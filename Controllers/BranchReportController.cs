using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using SB.Dto;

namespace SB.Controllers
{
    [Authorize]
    [Route("api/BranchReport")]
    [ApiController]
    public class BranchReportController : ControllerBase
    {
        wucha_cloudContext _context = new wucha_cloudContext();

         [AllowAnonymous]
        [HttpGet()]
        public IActionResult getBranchReportByDate([FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            if (start == null || end == null)
                return BadRequest(ModelState);
            //if (!ModelState.IsValid)
            //    return BadRequest(ModelState);

            //setup time filter
            var myfilter = new FilterDto();
            myfilter.Start = start;
            myfilter.End = end.AddDays(1);

            //get Result List
            var myResult = getBranchReport(myfilter);
            return Ok(myResult);
        }

        public List<BranchReportDto> getBranchReport([FromBody] FilterDto myfilter)
        {
            _context.ChangeTracker.QueryTrackingBehavior = Microsoft.EntityFrameworkCore.QueryTrackingBehavior.NoTracking;  //saving garbage collection

            var BranchInvoiceList = (from i in _context.Invoice
                                     join b in _context.Branch on i.Branch equals b.Id

                                     select new
                                     {
                                         i.InvoiceNumber,
                                         i.CommitDate,
                                         i.Total,
                                         i.Paid,
                                         BranchName = b.Name,
                                         Branch = b.Id,
                                         b.Activated
                                     })
                                    .Where(i => i.CommitDate == null ? true : i.CommitDate >= myfilter.Start)
                                    .Where(i => i.CommitDate == null ? true : i.CommitDate <= myfilter.End)
                                    .Where(i => myfilter.BranchId != null ? (i.Branch == myfilter.BranchId) : true)
                                    .Where(b => b.Activated == true);


            var saleslist =
                _context.Branch
                .Where(b => b.Activated == true)
                .Where(b => myfilter.BranchId != null ? (b.Id == myfilter.BranchId) : true)
                .Select(b => new { BranchId = b.Id, BranchName = b.Name })
                .Join(
                    _context.Invoice
                .Where(i => i.CommitDate >= myfilter.Start)
                .Where(i => i.CommitDate <= myfilter.End)
                .Select(i => new { i.InvoiceNumber, i.Branch, i.CommitDate }),
                b => b.BranchId,
                i => i.Branch,
                (b, i) => new { i.InvoiceNumber, b.BranchName, i.CommitDate, i.Branch });

            var sales = from s in _context.Sales
                        join b in BranchInvoiceList on s.InvoiceNumber equals b.InvoiceNumber
                        select new
                        {
                            s.Code,
                            s.Name,
                            s.Cat,
                            s.CommitPrice,
                            s.SupplierPrice,
                            s.Quantity,
                            s.TaxRate,
                            b.CommitDate,
                            b.InvoiceNumber,
                            b.Branch,
                            b.BranchName
                        };

            double overalltotal = Math.Round((double)sales.Select(s => Math.Round((double)s.CommitPrice) * s.Quantity * (1 + s.TaxRate)).Sum().Value, 2); 
            double overallprofit = Math.Round((double)sales.Select(s => Math.Round((double)s.CommitPrice - (double)s.SupplierPrice) * s.Quantity * (1 + s.TaxRate)).Sum().Value,2);
            double overalltrans = BranchInvoiceList.Count()== 0 ? 1: BranchInvoiceList.Count();
            double overallconsumPerTrans = Math.Round(overalltotal/ overalltrans, 2);

            var report = (from s in sales
                          group s by s.BranchName into g
                          select new BranchReportDto
                          {

                              BranchName = g.Key,

                              salesTotal = Math.Round((from s in g
                                                       select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value, 2),

                              profitTotal = Math.Round((from p in g
                                                        select ((double)p.CommitPrice - (double)p.SupplierPrice) * (1 + p.TaxRate) * p.Quantity).Sum().Value, 2),

                              percent = Math.Round((from s in g
                                                    select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value / overalltotal * 100, 0),
                              profitpercent = Math.Round((from p in g
                                                          select ((double)p.CommitPrice - (double)p.SupplierPrice) * (1 + p.TaxRate) * p.Quantity).Sum().Value / overallprofit * 100, 2),

                              TransQty = (from tq in g
                                          select tq.InvoiceNumber).Distinct().Count(),

                              consumPerTrans = Math.Round((from s in g
                                                           select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value / (from tq in g
                                                                                                                                       select tq.InvoiceNumber).Distinct().Count(), 2),
                              overallTotal = overalltotal,
                              overallProfit = overallprofit,
                              overallTrans = overalltrans,
                              overallConsumPerTrans = overallconsumPerTrans
                              //salesbycat = (from s in g
                              //              group s by s.Cat into cg
                              //              select new
                              //              {
                              //                  cat = cg.Key,
                              //                  total = Math.Round((from sc in cg
                              //                                      select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum().Value, 2),
                              //                  percent = Math.Round(((from sc in cg
                              //                                         select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum() / ((from s in g
                              //                                                                                                                   select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum()) * 100).Value, 2) + "%"
                              //              }).OrderByDescending(o => o.total).Take(10)

                          }).ToList();

            return report;
        }
    }
}