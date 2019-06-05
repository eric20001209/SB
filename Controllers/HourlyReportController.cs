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
                .Select(i => new { i.InvoiceNumber,i.Branch,i.CommitDate }).ToList();


            //var transList = (from tl in _context.TranInvoice
            //                 join i in _context.Invoice on tl.InvoiceNumber equals i.InvoiceNumber
            //                 select new
            //                 {
            //                     i.InvoiceNumber,
            //                     tl.Id,
         
            //                 });

            var transList = _context.TranInvoice.Select
                (ti => new
                {
                    ti.TranId,
                    ti.InvoiceNumber,
                    ti.AmountApplied
                })
                .Join(
                invoicesList,
                ti => ti.InvoiceNumber,
                i => i.InvoiceNumber,
                (ti, i) => new
                {
                    invoice_number = i.InvoiceNumber,
                    tran_id = ti.TranId ,
                    i.CommitDate,
                    amountApplied = ti.AmountApplied
                })
                .Join(
                _context.TranDetail
                .Select(td =>new { tran_id = td.Id, td.PaymentMethod,td.CardId}),
                tl=>tl.tran_id,
                td=>td.tran_id,
                (tl,td) => new {tl.CommitDate, tl.amountApplied, tl.invoice_number,td.PaymentMethod}).GroupBy(i=>i.CommitDate.Hour);

            return Ok();
        }

    }
}