using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Data;
using SB.Dto;
using SB.Services;
using Microsoft.AspNetCore.Authorization;

namespace SB.Controllers
{
    [Route("api/salesinvoice")]
    [ApiController]
    public class SalesInvoiceReportController : ControllerBase
    {

        private readonly wucha_cloudContext _context ;
        public SalesInvoiceReportController(wucha_cloudContext context)  //dependency injection
        {
            _context = context;
        }

        [HttpGet("invoicelist")]
        public IActionResult getInvoiceList([FromQuery] int? branch, [FromQuery] DateTime start, [FromQuery] DateTime end
            , [FromQuery] TimeSpan start_time, [FromQuery] TimeSpan end_time, [FromQuery] int? invoice_number)
        {
            var myfilter = new SalesInvoiceReportFilterDto();
            myfilter.BranchId = branch;
            myfilter.Start = start;
            myfilter.End = end;
            myfilter.start_time = start_time;
            myfilter.end_time = end_time;
            myfilter.invoice_number = invoice_number;

            _context.ChangeTracker.QueryTrackingBehavior = Microsoft.EntityFrameworkCore.QueryTrackingBehavior.NoTracking;  //saving garbage collection
            var returnlist = _context.Invoice
                .Where(i => myfilter.BranchId.HasValue ? i.Branch == myfilter.BranchId : true)
                .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)
                //.Where(i => myfilter.start_time == null ? true : i.CommitDate.TimeOfDay >= myfilter.start_time)
                //.Where(i => myfilter.end_time == null ? true : i.CommitDate.TimeOfDay <= myfilter.end_time)
                .Where(i => myfilter.invoice_number.HasValue ? i.InvoiceNumber == myfilter.invoice_number : true)
                .Join(_context.Branch
                .Select(b => new { b.Name, b.Id }),
                i => i.Branch,
                b => b.Id,
                //(i,b) => new {BranchName = b.Name, i.InvoiceNumber, BranchId = i.Branch, CommitDate = i.CommitDate.Date + "/"+i.CommitDate.Month + "/" + i.CommitDate.Year + " " + i.CommitDate.Hour + ":" + i.CommitDate.Minute + ":" + i.CommitDate.Second, i.Total })
                (i, b) => new { BranchName = b.Name, i.InvoiceNumber, BranchId = i.Branch, CommitDate = i.CommitDate.ToShortDateString() + "  " + i.CommitDate.ToShortTimeString(), i.Total })
                .OrderByDescending(i => i.InvoiceNumber)
                //.GroupBy(ib => ib.BranchId)
                .ToList();

            return Ok(returnlist);
        }

        [AllowAnonymous]
        [HttpGet()]
        public IActionResult getSalesInvoiceReport([FromQuery] int? invoice_number)
        {
            //setup filter
            var myfilter = new SalesInvoiceReportFilterDto();
            myfilter.invoice_number = invoice_number;

            //get returnlist
            var returnlist = CreateSalesInvoice(myfilter);
            return Ok(returnlist);
        }

        private InvoiceDto CreateSalesInvoice(SalesInvoiceReportFilterDto myfilter) 
        {
            InvoiceDto invoice = new InvoiceDto();
            if (myfilter.Start == null || myfilter.End == null)
                return invoice;

            _context.ChangeTracker.QueryTrackingBehavior = Microsoft.EntityFrameworkCore.QueryTrackingBehavior.NoTracking;  //saving garbage collection

            var invoice_count = _context.Invoice.Where(i => i.InvoiceNumber == myfilter.invoice_number).Count();
            if (invoice_count == 0)
                return invoice;
            var commite_date = _context.Invoice.Where(i => i.InvoiceNumber == myfilter.invoice_number).Select(i => i.CommitDate).FirstOrDefault();
            var tax = _context.Invoice.Where(i => i.InvoiceNumber == myfilter.invoice_number).Select(i => i.Tax).FirstOrDefault();
            var total = _context.Invoice.Where(i => i.InvoiceNumber == myfilter.invoice_number).Select(i => i.Total).FirstOrDefault();

            var itemlist =
           //              (from i in _context.Invoice.Where(i => myfilter.invoice_number.HasValue ? i.InvoiceNumber == myfilter.invoice_number : true)
           //                join b in _context.Branch on i.Branch equals b.Id
           //                join s in _context.Sales on i.InvoiceNumber equals s.InvoiceNumber

           //                select new SalesInvoiceItemDto
           //                {
           //                    code = s.Code,
           //                    name_cn = s.NameCn,
           //                    name = s.Name,
           //                    price = (double)s.CommitPrice,
           //                    qty = s.Quantity,
           //                    sales_total = Math.Round((double)s.CommitPrice * s.Quantity, 2)
           //                }).ToList();



           _context.Invoice
           .Where(i => myfilter.invoice_number.HasValue ? i.InvoiceNumber == myfilter.invoice_number : true)

            .Select(i => new { i.InvoiceNumber, BranchId = i.Branch, i.CommitDate, i.Total })
            .Join(_context.Branch.Select(b => new { BranchId = b.Id, BranchName = b.Name }),
            i => i.BranchId,
            b => b.BranchId,
            (i, b) => new { BranchName = b.BranchName, i.InvoiceNumber, i.CommitDate, i.Total })
            .Join(_context.Sales.Select(s => new { s.InvoiceNumber, s.Code, s.NameCn, s.Name, s.CommitPrice, s.Quantity, s.TaxRate, s.SalesTotal }),
            (ib => ib.InvoiceNumber),
            (s => s.InvoiceNumber),
            (ib, s) => new SalesInvoiceItemDto { code = s.Code, name_cn = s.NameCn, name = s.Name, price = (double)s.CommitPrice, qty = s.Quantity, sales_total = Math.Round((double)s.CommitPrice * s.Quantity, 2) })
            .ToList();

            var paymentlist = _context.TranInvoice
                .Where(ti => myfilter.invoice_number.HasValue ? ti.invoice_number == myfilter.invoice_number : true)
                .Select(ti => new PaymentReportDto { payment_method = ti.payment_method.ToString(), amount = ti.AmountApplied }).ToList();

            foreach (var payment in paymentlist)
            {
                payment.payment_method = getPayment_method(int.Parse(payment.payment_method));
            }

            invoice.inovice_number = myfilter.invoice_number;
            invoice.sales_items = itemlist;
            invoice.commit_date = commite_date;
            invoice.tax = Math.Round((double)tax.Value,3);
            invoice.total = total;
            invoice.payment = paymentlist;

            return invoice;
        }


        //string getPayment_method(int? i)
        //{
        //    Dictionary<int?, string> paymentMethodList = new Dictionary<int?, string>();
        //    string payment_method = "";

        //    var payment_method_list = _context.EnumTable.Where(et => et.Class == "payment_method")
        //        .Select(et => new { et.Id, et.Name })
        //        .OrderBy(et => et.Id);
        //    foreach (var et in payment_method_list)
        //    {
        //        paymentMethodList.Add(et.Id, et.Name);
        //    }

        //    if (paymentMethodList.ContainsKey(i))
        //    {
        //        payment_method = paymentMethodList[i];
        //    }
        //    return payment_method;
        //}
        string getPayment_method(int? i)
        {
            var payment = _context.EnumTable.Where(et => et.Class == "payment_method" && et.Id == i)
                .Select(et => new {et.Id, et.Name }).ToList().FirstOrDefault();
            return payment.Name;
        }
    }
}