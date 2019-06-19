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
    [Route("api/salesinvoicereport")]
    [ApiController]
    public class SalesInvoiceReportController : ControllerBase
    {
        private wucha_cloudContext _context;
        public SalesInvoiceReportController(wucha_cloudContext context)  //dependency injection
        {
            _context = context;
        }

        [HttpGet()]
        public IActionResult getSalesInvoiceReport([FromQuery] int? branch, [FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            //setup filter
            var myfilter = new FilterDto();
            myfilter.BranchId = branch;
            myfilter.Start = start;
            myfilter.End = end;

            //get returnlist
            var returnlist = CreateSalesInvoiceReport(myfilter);
            return Ok(returnlist);
        }

        private SalesInvoiceReportDto CreateSalesInvoiceReport(FilterDto myfilter)
        {
            SalesInvoiceReportDto report = new SalesInvoiceReportDto();
            return report;
        }
    }
}