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

        [HttpGet()]
        public IActionResult getSalesInvoiceReport([FromQuery] int? branch, [FromQuery] DateTime start, [FromQuery] DateTime end
            , [FromQuery] DateTime start_time, [FromQuery] DateTime end_time, [FromQuery] int? invoice_number, [FromQuery] decimal amount)
        {
            //setup filter
            var myfilter = new SalesInvoiceReportFilterDto();
            myfilter.BranchId = branch;
            myfilter.Start = start;
            myfilter.End = end;
            myfilter.start_time = start_time;
            myfilter.end_time = end_time;
            myfilter.invoice_number = invoice_number;
            myfilter.amount = amount;

            //get returnlist
            var returnlist = CreateSalesInvoiceReport(myfilter);
            return Ok(returnlist);
        }

        private List<SalesInvoiceItemDto> CreateSalesInvoiceReport(SalesInvoiceReportFilterDto myfilter) 
        {
            List<SalesInvoiceItemDto> report = new List<SalesInvoiceItemDto>();
            if (myfilter.Start == null || myfilter.End == null)
                return report;

            var list = _context.Invoice
                //.Where(i => myfilter.BranchId.ToString() == null ? true: i.Branch == myfilter.BranchId)
                //.Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                //.Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)
                //.Where(i => myfilter.start_time.TimeOfDay == null ? true : i.CommitDate.TimeOfDay >= myfilter.start_time.TimeOfDay)
                //.Where(i => myfilter.end_time.TimeOfDay == null ? true : i.CommitDate.TimeOfDay <= myfilter.end_time.TimeOfDay)
                //.Where(i=> myfilter.invoice_number.ToString() == null ? true : i.InvoiceNumber == myfilter.invoice_number)

                .Select(i => new { i.InvoiceNumber, BranchId = i.Branch, i.CommitDate, i.Total })
                .Join(_context.Branch.Select(b => new { BranchId = b.Id, BranchName = b.Name }),
                i => i.BranchId,
                b => b.BranchId,
                (i, b) => new { BranchName = b.BranchName, i.InvoiceNumber, i.CommitDate, i.Total })
                .Join(_context.Sales.Select(s=>new { s.InvoiceNumber, s.Code, s.NameCn,s.Name, s.CommitPrice,s.Quantity,s.SalesTotal}),
                (ib=>ib.InvoiceNumber),
                (s=>s.InvoiceNumber),
                (ib,s)=>new SalesInvoiceItemDto { code=s.Code, name_cn = s.NameCn, name=s.Name, price = s.CommitPrice, qty = s.Quantity, sales_total= s.SalesTotal }).ToList()
                ;

            return list;
        }
    }
}