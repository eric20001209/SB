using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Data;
using SB.Dto;

namespace SB.Controllers
{
    [Route("api/salesinvoice")]
    [ApiController]
    public class SalesInvoiceReportController : ControllerBase
    {
        private wucha_cloudContext _context;
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
                (i, b) => new { BranchName = b.Name, i.InvoiceNumber, BranchId = i.Branch, CommitDate = i.CommitDate.Date.ToShortTimeString().ToString(), i.Total })
                .OrderByDescending(i => i.InvoiceNumber)
                //.Contains()
                .GroupBy(ib => ib.BranchId)
                .ToList();

            return Ok(returnlist);
        }

        [HttpGet()]
        public IActionResult getSalesInvoiceReport([FromQuery] int? branch, [FromQuery] DateTime start, [FromQuery] DateTime end
            , [FromQuery] TimeSpan start_time, [FromQuery] TimeSpan end_time, [FromQuery] int? invoice_number)
        {
            //setup filter
            var myfilter = new SalesInvoiceReportFilterDto();
            myfilter.BranchId = branch;
            myfilter.Start = start;
            myfilter.End = end;
            myfilter.start_time = start_time;
            myfilter.end_time = end_time;
            myfilter.invoice_number = invoice_number;

            //get returnlist
            var returnlist = CreateSalesInvoiceReport(myfilter);
            return Ok(returnlist);
        }

        private List<IGrouping<int?, SalesInvoiceItemDto>> CreateSalesInvoiceReport(SalesInvoiceReportFilterDto myfilter) 
        {
            List<IGrouping<int?, SalesInvoiceItemDto >> report = new List<IGrouping<int?, SalesInvoiceItemDto>>();
            if (myfilter.Start == null || myfilter.End == null)
                return report;

            _context.ChangeTracker.QueryTrackingBehavior = Microsoft.EntityFrameworkCore.QueryTrackingBehavior.NoTracking;  //saving garbage collection

            var list = _context.Invoice
                .Where(i => myfilter.BranchId.HasValue ? i.Branch == myfilter.BranchId : true)
                .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)
                .Where(i => myfilter.start_time == null ? true : i.CommitDate.TimeOfDay >= myfilter.start_time)
                .Where(i => myfilter.end_time == null ? true : i.CommitDate.TimeOfDay <= myfilter.end_time)
                .Where(i => myfilter.invoice_number.HasValue ? i.InvoiceNumber == myfilter.invoice_number : true)

                .Select(i => new { i.InvoiceNumber, BranchId = i.Branch, i.CommitDate, i.Total })
                .Join(_context.Branch.Select(b => new { BranchId = b.Id, BranchName = b.Name }),
                i => i.BranchId,
                b => b.BranchId,
                (i, b) => new { BranchName = b.BranchName, i.InvoiceNumber, i.CommitDate, i.Total })
                .Join(_context.Sales.Select(s => new { s.InvoiceNumber, s.Code, s.NameCn, s.Name, s.CommitPrice, s.Quantity, s.SalesTotal }),
                (ib => ib.InvoiceNumber),
                (s => s.InvoiceNumber),
                (ib, s) => new SalesInvoiceItemDto { invoice_number = s.InvoiceNumber, code = s.Code, name_cn = s.NameCn, name = s.Name, price = s.CommitPrice, qty = s.Quantity })
                .GroupBy(ibs => ibs.invoice_number)
                .ToList();
                

            return list;
        }
    }
}