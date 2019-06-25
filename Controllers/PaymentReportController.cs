using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SB.Data;
using SB.Dto;

namespace SB.Controllers
{
    [Route("api/payment")]
    [ApiController]
    public class PaymentReportController : ControllerBase
    {
        wucha_cloudContext _context = new wucha_cloudContext();

        [AllowAnonymous]
        [HttpGet("Branches")]
        public IActionResult getBranches()
        {
            var branches = _context.Branch
                .Where(b => b.Id != 1)
                .Where(b => b.Activated == true)
                .Select(b => new { b.Name, b.Id });
            return Ok(branches);
        }

        [HttpGet()]
        public IActionResult getPaymentReport([FromQuery] int? branch, [FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            if (start == null || end == null)
                return BadRequest(ModelState);

            //setup filter
            var myfilter = new FilterDto();
            myfilter.BranchId = branch;
            myfilter.Start = start;
            myfilter.End = end.AddDays(1);

            //get return list
            return Ok(paymentReportList(myfilter));
        }

        private List<List<PaymentReportDto>> paymentReportList([FromBody] FilterDto myfilter)
        {
            //List<PaymentReportDto> mylist = new List<PaymentReportDto>();

            var invoicesList = _context.Invoice
                .Where(i => myfilter.BranchId == null ? true : i.Branch == myfilter.BranchId)
                .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)
                .Select(i => new { i.InvoiceNumber })
                .Join(
                    _context.TranInvoice.Select(ti => new
                    {
                        ti.TranId,
                        ti.InvoiceNumber,
                        ti.AmountApplied
                    }),
                i => i.InvoiceNumber,
                ti => ti.InvoiceNumber,
                (i, ti) => new { i.InvoiceNumber, ti.TranId,ti.AmountApplied });

            var mylist = (from i in invoicesList
                      join td in _context.TranDetail on i.TranId equals td.Id
                      join e in _context.EnumTable.Where(e => e.Class == "payment_method") on td.PaymentMethod equals e.Id
                      select new  {
                          e.ClassType,
                          amount = i.AmountApplied, 
                          payment_method = e.Name
                      }).ToList();

            var groupbypayment = (from i in mylist
                             group i by i.payment_method into g
                             select new PaymentReportDto
                             {
                                 payment_method = g.Key,
                                 amount = Math.Round((from i in g
                                          select i.amount).Sum(),2)
                             }).Take(6).ToList();


            var groupbyclass = (from i in mylist
                                  group i by i.ClassType into g
                                  select new PaymentReportDto
                                  {
                                      payment_method = g.Key,
                                      amount = Math.Round((from i in g
                                                           select i.amount).Sum(), 2)
                                  }).ToList();

            List<List<PaymentReportDto>> returnlist = new List<List<PaymentReportDto>> { groupbypayment, groupbyclass };

            //    .Join(
            //        _context.TranDetail.Select(td => new { TranId = td.Id, payment_method = td.PaymentMethod }),
            //    iti => iti.ti.TranId,
            //    td => td.TranId,
            //(iti, td) => new { });
            //.Join
            //(
            //_context.EnumTable.Where(et=>et.Class == "payment_method").Select(et => new { payment_method = et.Id, payment_method_name = et.Name}),
            //t=>t.payment_method,
            //et=>et.payment_method,
            //(t,et)=>new PaymentReportDto {
            //    amount=t.amountApplied,
            //    payment_method = et.payment_method_name,
            //}).Take(100).ToList();

            //var list = _context.TranInvoice.Select(i => new { i.AmountApplied, i.TranId })
            //    .Join(_context.TranDetail.Select(td => new { td.Id, td.PaymentMethod }),
            //    i => i.TranId,
            //    td => td.Id,
            //    (i, td) => new { i, td });

            //mylist = (from e in _context.EnumTable.Where(e=>e.Class=="payment_method").ToList()
            //          join i in list on e.Id equals i.td.PaymentMethod
            //          select new PaymentReportDto { amount = i.i.AmountApplied, payment_method = e.Name }).ToList();
            //.Join(_context.EnumTable
            //.Where(et => et.Class == "payment_method")
            ////.Where(et=>et.Id!=4).Where(et => et.Id != 7).Where(et => et.Id != 8).Where(et => et.Id != 11).Where(et => et.Id != 12)
            //.Select(et => new { payment_method=et.Id, payment_method_name = et.Name }),
            //itd => itd.td.PaymentMethod,
            //et => et.payment_method,
            //(itd, et) => new PaymentReportDto { amount = itd.i.AmountApplied, payment_method = et.payment_method_name }).Take(100).ToList();

            return returnlist;
        }
    }
}