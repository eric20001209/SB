using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Data;
using Microsoft.AspNetCore.Authorization;
using SB.Dto;

namespace SB.Controllers
{
    [Route("api/hourly")]
    [ApiController]
    public class HourlyReportController : ControllerBase
    {
        wucha_cloudContext _context = new wucha_cloudContext();

        [AllowAnonymous]
        [HttpGet("Branches")]
        public IActionResult getBranches()
        {
            var branches = _context.Branch
                .Where(b => b.Id != 1)
                .Where(b => b.Activated == true).FirstOrDefault();
            return Ok(branches);
        }

        [HttpPost("HourlyReport")]
        public IActionResult getHourlyReport([FromBody] FilterDto myfilter)
        {

            var invoicesList = _context.Invoice.Where(i => myfilter.BranchId.ToString() == "-1" ? true : i.Branch == myfilter.BranchId)
                .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)
                .Select(i => new { i.InvoiceNumber }).ToList();


            //var transList = (from tl in _context.TranDetail
            //                 join i in invoicesList on tl.InvoiceNumber equals i.InvoiceNumber
            //                 select new
            //                 {
            //                     i.InvoiceNumber, tl.Id, tl.CardId, tl.PaymentMethod
            //                 });

            //var transList = _context.TranDetail.Select
            //    (td => new
            //    {
            //        td.Id,
            //        td.InvoiceNumber,
            //        td.CardId,
            //        td.PaymentMethod
            //    })
            //    .Join( invoicesList,
            //    td => td.InvoiceNumber,
            //    i => i.InvoiceNumber,
            //    (td, i) => new
            //    {
            //        invoice_number = i.InvoiceNumber,
            //        tran_id = td.Id,
            //        payment_method = td.PaymentMethod
            //    });

            return Ok();
        }

    }
}