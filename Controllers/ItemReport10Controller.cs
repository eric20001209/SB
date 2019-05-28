using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Data;
using SB.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace webAPISQL.Controllers
{
    [Authorize]
    [Route("api/itemreport10")]
    [ApiController]
    public class ItemReport10Controller : ControllerBase
    {
        wucha_cloudContext _context = new wucha_cloudContext();
        readonly ILogger<ItemReport10Controller> _ilogger;
        public ItemReport10Controller(ILogger<ItemReport10Controller> logger)
        {
            _ilogger = logger;
        }

        //[AllowAnonymous]
        [HttpPost("month")]
        public IActionResult getAnualDataByMonth([FromBody] FilterDto myfilter)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

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
                                    //.Where(i=>i.Paid == true)
                                    .Where(b => b.Activated == true);

            double total = (double)BranchInvoiceList.Sum(i => i.Total).Value;

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
                            b.InvoiceNumber
                        };

            var reportMonth = (from s in sales
                               group s by s.CommitDate.Month.ToString() into g
                               select new
                               {
                                   month = ConvertIntToMonth(g.Key),
                                   salesTotal = Math.Round((from s in g
                                                            select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value, 2),

                                   profitTotal = Math.Round((from p in g
                                                             select ((double)p.CommitPrice - (double)p.SupplierPrice) * (1 + p.TaxRate) * p.Quantity).Sum().Value, 2),

                                   percent = Math.Round((from s in g
                                                         select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value / total * 100, 0),

                                   TransQty = (from tq in g
                                               select tq.InvoiceNumber).Distinct().Count(),

                                   salesbycat = (from s in g
                                                 group s by s.Cat into cg
                                                 select new
                                                 {
                                                     cat = cg.Key,
                                                     total = Math.Round((from sc in cg
                                                                         select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum().Value, 2),
                                                     percent = Math.Round(((from sc in cg
                                                                            select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum() / ((from s in g
                                                                                                                                              select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum()) * 100).Value, 2) + "%"
                                                 }).OrderByDescending(o => o.total).Take(10)

                               });
            return Ok(reportMonth);
        }

        //[AllowAnonymous]
        [HttpGet("month")]
        public IActionResult getAnualDataByMonth([FromQuery] string start, [FromQuery] string end)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

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
                                    .Where(i => i.CommitDate >= DateTime.Parse(start))
                                    .Where(i => i.CommitDate <= DateTime.Parse(end))
                                    //.Where(i=>i.Paid == true)
                                    .Where(b => b.Activated == true);

            double total = (double)BranchInvoiceList.Sum(i => i.Total).Value;

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
                            b.InvoiceNumber
                        };

            var reportMonth = (from s in sales
                               group s by s.CommitDate.Month.ToString() into g
                               select new
                               {
                                   month = ConvertIntToMonth(g.Key),
                                   salesTotal = Math.Round((from s in g
                                                            select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value, 2),

                                   profitTotal = Math.Round((from p in g
                                                             select ((double)p.CommitPrice - (double)p.SupplierPrice) * (1 + p.TaxRate) * p.Quantity).Sum().Value, 2),

                                   percent = Math.Round((from s in g
                                                         select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value / total * 100, 0),

                                   TransQty = (from tq in g
                                               select tq.InvoiceNumber).Distinct().Count(),

                                   salesbycat = (from s in g
                                                 group s by s.Cat into cg
                                                 select new
                                                 {
                                                     cat = cg.Key,
                                                     total = Math.Round((from sc in cg
                                                                         select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum().Value, 2),
                                                     percent = Math.Round(((from sc in cg
                                                                            select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum() / ((from s in g
                                                                                                                                              select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum()) * 100).Value, 2) + "%"
                                                 }).OrderByDescending(o => o.total).Take(10)

                               });
            return Ok(reportMonth);
            return Ok();
        }

        [HttpGet("byDay")]
        public IActionResult getMyInvoiceList()
        {
            var BranchInvoiceList = (from i in _context.Invoice
                                     join b in _context.Branch on i.Branch equals b.Id

                                     select new
                                     {
                                         i.InvoiceNumber,
                                         i.CommitDate,
                                         i.Total,
                                         BranchName = b.Name,
                                         Branch = b.Id,
                                         b.Activated
                                     })
                        .Where(b => b.Activated == true);

            _ilogger.LogInformation("total invoice quantity: " + BranchInvoiceList.Count().ToString());

            var reportDayofWeek = from i in BranchInvoiceList
                                  group i by i.CommitDate.DayOfWeek.ToString() into g
                                  select new itemReport10
                                  {
                                      day = g.Key,
                                      salesTotal = Math.Round((from p in g
                                                               select p.Total).Sum().Value, 2)
                                  };

            var reportMonth = from i in BranchInvoiceList
                              group i by i.CommitDate.Month.ToString() into g
                              select new itemReport10
                              {
                                  day = (from d in g
                                         select d.CommitDate.Day).ToString(),

                                  month = g.Key,
                                  salesTotal = Math.Round((from p in g
                                                           select p.Total).Sum().Value, 2)
                              };
            reportMonth = reportMonth.OrderBy(i => i.day);
            if (reportMonth == null)
                return NotFound();

            List<itemReport10> newReportMonth = new List<itemReport10>();
            foreach (var i in reportMonth)
            {
                i.month = ConvertIntToMonth(i.month);
                newReportMonth.Add(i);
            }

            var myFinalList = new { reportDayofWeek, newReportMonth };

            return Ok(myFinalList);
        }
        public string ConvertIntToMonth(string myInt)
        {
            switch (myInt)
            {
                default:
                    return myInt;
                case "1":
                    return "JAN";
                case "2":
                    return "FEB";
                case "3":
                    return "MAR";
                case "4":
                    return "APR";
                case "5":
                    return "MAY";
                case "6":
                    return "JUN";
                case "7":
                    return "JUL";
                case "8":
                    return "AUG";
                case "9":
                    return "SEP";
                case "10":
                    return "OCT";
                case "11":
                    return "NOV";
                case "12":
                    return "DEC";
            }
        }

        [AllowAnonymous]
        [HttpGet("byDay/{branchId}/{start}/{end}")]
        public IActionResult MyInvoiceList(int BranchId, DateTime start, DateTime end)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var BranchInvoiceList = (from i in _context.Invoice
                                     join b in _context.Branch on i.Branch equals b.Id

                                     select new
                                     {
                                         i.InvoiceNumber,
                                         i.CommitDate,
                                         i.Total,
                                         BranchName = b.Name,
                                         Branch = b.Id,
                                         b.Activated
                                     })
                                    .Where(i => i.CommitDate >= start)
                                    .Where(i => i.CommitDate <= end)
                                    .Where(b => b.Activated == true);

            if (!string.IsNullOrEmpty(BranchId.ToString()) && BranchId.ToString() != "-1")
            {
                BranchInvoiceList = BranchInvoiceList.Where(i => i.Branch == BranchId);
            }

            var sales = from s in _context.Sales
                        join b in BranchInvoiceList on s.InvoiceNumber equals b.InvoiceNumber
                        select new
                        {
                            s.Code,
                            s.Name,
                            s.Cat,
                            s.CommitPrice,
                            s.Quantity,
                            s.TaxRate,
                            b.CommitDate,
                        };
            var reportDayofWeek = from s in sales
                                  group s by s.CommitDate.DayOfWeek.ToString() into g
                                  select new
                                  {
                                      day = g.Key,
                                      salesTotal = Math.Round((from s in g
                                                               select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value, 2),
                                      salesbycat = (from s in g
                                                    group s by s.Cat into cg
                                                    select new
                                                    {
                                                        cat = cg.Key,
                                                        total = Math.Round((from sc in cg
                                                                            select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum().Value, 2),
                                                        percent = Math.Round(((from sc in cg
                                                                               select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum() / ((from s in g
                                                                                                                                                 select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum()) * 100).Value, 2) + "%"
                                                    }).OrderByDescending(o => o.total).Take(10)

                                  };

            var reportMonth = from i in BranchInvoiceList
                              group i by i.CommitDate.Month.ToString() into g
                              select new itemReport10
                              {
                                  month = g.Key,
                                  salesTotal = Math.Round((from p in g
                                                           select p.Total).Sum().Value, 2)
                              };
            reportMonth = reportMonth.OrderBy(i => i.month.Length);
            if (reportMonth == null)
                return NotFound();

            List<itemReport10> newReportMonth = new List<itemReport10>();
            foreach (var i in reportMonth)
            {
                i.month = ConvertIntToMonth(i.month);
                newReportMonth.Add(i);
            }

            var myFinalList = new { reportDayofWeek, newReportMonth };

            return Ok(myFinalList);
        }

        //[AllowAnonymous]
        [HttpPost("byDay")]
        public IActionResult getMyInvoiceList([FromBody] FilterDto myfilter, [FromQuery] string day)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var BranchInvoiceList = (from i in _context.Invoice
                                     join b in _context.Branch on i.Branch equals b.Id

                                     select new
                                     {
                                         i.InvoiceNumber,
                                         i.CommitDate,
                                         i.Total,
                                         BranchName = b.Name,
                                         Branch = b.Id,
                                         b.Activated
                                     })
                                    .Where(i => i.CommitDate >= myfilter.Start)
                                    .Where(i => i.CommitDate <= myfilter.End)
                                    .Where(b => b.Activated == true);

            if (!string.IsNullOrEmpty(myfilter.BranchId.ToString()) && myfilter.BranchId.ToString() != "-1")
            {
                BranchInvoiceList = BranchInvoiceList.Where(i => i.Branch == myfilter.BranchId);
            }

            var sales = from s in _context.Sales
                        join b in BranchInvoiceList on s.InvoiceNumber equals b.InvoiceNumber
                        select new
                        {
                            s.Code,
                            s.Name,
                            s.Cat,
                            s.CommitPrice,
                            s.Quantity,
                            s.TaxRate,
                            b.CommitDate,
                        };
            var reportDayofWeek = from s in sales
                                  group s by s.CommitDate.DayOfWeek.ToString() into g
                                  select new
                                  {
                                      day = g.Key,
                                      salesTotal = Math.Round((from s in g
                                                               select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value, 2),
                                      salesbycat = (from s in g
                                                    group s by s.Cat into cg
                                                    select new
                                                    {
                                                        cat = cg.Key,
                                                        total = Math.Round((from sc in cg
                                                                            select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum().Value, 2),
                                                        percent = Math.Round(((from sc in cg
                                                                               select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum() / ((from s in g
                                                                                                                                                 select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum()) * 100).Value, 2)
                                                    }).OrderByDescending(o => o.total).Take(10)

                                  };

            var reportMonth = from i in BranchInvoiceList
                              group i by i.CommitDate.Month.ToString() into g
                              select new itemReport10
                              {
                                  month = g.Key,
                                  salesTotal = Math.Round((from p in g
                                                           select p.Total).Sum().Value, 2)
                              };
            reportMonth = reportMonth.OrderBy(i => i.month.Length);
            if (reportMonth == null)
                return NotFound();

            List<itemReport10> newReportMonth = new List<itemReport10>();
            foreach (var i in reportMonth)
            {
                i.month = ConvertIntToMonth(i.month);
                newReportMonth.Add(i);
            }

            var myFinalList = new { reportDayofWeek, newReportMonth };

            return Ok(myFinalList);
        }



        [AllowAnonymous]
        [HttpGet("cat")]
        public IActionResult getSalesGroupbyCategory([FromQuery] string branchid, [FromQuery] DateTime start, [FromQuery] DateTime end, [FromQuery] DayOfWeek day)
        {
            var BranchInvoiceList = (from i in _context.Invoice
                                     join b in _context.Branch on i.Branch equals b.Id

                                     select new
                                     {
                                         i.InvoiceNumber,
                                         i.CommitDate,
                                         i.Total,
                                         BranchName = b.Name,
                                         Branch = b.Id,
                                         b.Activated
                                     })
                        .Where(i => i.CommitDate >= start)
                        .Where(i => i.CommitDate <= end)
                        .Where(b => b.Activated == true);

            var salesDetail = (from s in _context.Sales
                               join b in BranchInvoiceList on s.InvoiceNumber equals b.InvoiceNumber

                               select new 
                               {
                                   id = s.Id,
                                   code = s.Code,
                                   name = s.Name,
                                   name_cn = s.NameCn,
                                   commit_price = s.CommitPrice,
                                   quantity = s.Quantity,
                                   tax_rate = s.TaxRate,
                                   cat = s.Cat,
                                   invoice_number = s.InvoiceNumber,
                                   commit_date = b.CommitDate
                               });

            if (string.IsNullOrEmpty(day.ToString()))
            {

            }

            var goupbycat = (from s in salesDetail
                             where s.commit_date.DayOfWeek == day
                             group s by s.commit_date.DayOfWeek.ToString() into g
                             select new
                             {
                                 cat = g.Key,
                                 salesTotal = Math.Round((from p in g
                                                          select ((double)p.commit_price * (1 + p.tax_rate) * p.quantity)).Sum().Value, 2)
                             }).OrderByDescending(o => o.salesTotal).Take(10);

            return Ok(goupbycat);

        }

        //[AllowAnonymous]
        [HttpPost("cat")]
        public IActionResult catrep([FromBody]FilterDto myfilter, [FromQuery]DayOfWeek day)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var BranchInvoiceList = (from i in _context.Invoice
                                     join b in _context.Branch on i.Branch equals b.Id

                                     select new
                                     {
                                         i.InvoiceNumber,
                                         i.CommitDate,
                                         i.Total,
                                         BranchName = b.Name,
                                         Branch = b.Id,
                                         b.Activated
                                     })
              .Where(i => i.CommitDate >= myfilter.Start)
              .Where(i => i.CommitDate <= myfilter.End)
              .Where(b => b.Activated == true);

            if (!string.IsNullOrEmpty(myfilter.BranchId.ToString()))
            {
                BranchInvoiceList = BranchInvoiceList.Where(i => i.Branch == myfilter.BranchId);
            }

            var sales = from s in _context.Sales
                        join b in BranchInvoiceList on s.InvoiceNumber equals b.InvoiceNumber
                        select new
                        {
                            s.Code,
                            s.Name,
                            s.Cat,
                            s.CommitPrice,
                            s.Quantity,
                            s.TaxRate,
                            b.CommitDate,
                        };
            var salesbydayofweek = from s in sales
                                   group s by s.CommitDate.DayOfWeek.ToString() into g
                                   select new
                                   {
                                       day = g.Key,
                                       salestotal = Math.Round((from s in g
                                                                select (double)s.CommitPrice * (1 + s.TaxRate) * s.Quantity).Sum().Value, 2),
                                       salesbycat = (from s in g
                                                     group s by s.Cat into cg
                                                     select new
                                                     {
                                                         cat = cg.Key,
                                                         total = Math.Round((from sc in cg
                                                                             select (double)sc.CommitPrice * (1 + sc.TaxRate) * sc.Quantity).Sum().Value, 2)
                                                     }).OrderByDescending(o => o.total).Take(10)

                                   };

            return Ok(salesbydayofweek);
        }

    }
}