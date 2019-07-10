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
                //.Where(b => b.Id != 1)
                .Where(b => b.Activated == true)
                .Select(b=>new { b.Name, b.Id});
            return Ok(branches);
        }
        //today
        [HttpGet("today")]
        public IActionResult today([FromQuery] int? branch)
        {
            //set up time filter
            FilterDto myfilter = new FilterDto();
            myfilter.today();
            myfilter.BranchId = branch;
            //get return
            var finalReturn = getHourlyReport(myfilter);
            return Ok(finalReturn);
        }

        //yesterday
        [HttpGet("yesterday")]
        public IActionResult yesterday([FromQuery] int? branch)
        {
            //set up time filter
            FilterDto myfilter = new FilterDto();
            myfilter.yesterday();
            myfilter.BranchId = branch;
            //get return
            var finalReturn = getHourlyReport(myfilter);
            return Ok(finalReturn);
        }

        //seven_days
        [HttpGet("seven_days")]
        public IActionResult seven_days([FromQuery] int? branch)
        {
            //set up time filter
            FilterDto myfilter = new FilterDto();
            myfilter.seven_days();
            myfilter.BranchId = branch;
            //get return
            var finalReturn = getHourlyReport(myfilter);
            return Ok(finalReturn);
        }

        //this month
        [HttpGet("this_month")]
        public IActionResult this_month([FromQuery] int? branch)
        {
            //set up time filter
            FilterDto myfilter = new FilterDto();
            myfilter.this_month();
            myfilter.BranchId = branch;
            //get return
            var finalReturn = getHourlyReport(myfilter);
            return Ok(finalReturn);
        }

        //last_month
        [HttpGet("last_month")]
        public IActionResult last_month([FromQuery] int? branch)
        {
            //set up time filter
            FilterDto myfilter = new FilterDto();
            myfilter.last_month();
            myfilter.BranchId = branch;
            //get return
            var finalReturn = getHourlyReport(myfilter);
            return Ok(finalReturn);
        }

        //last_3_month
        [HttpGet("last_3_month")]
        public IActionResult last_3_month([FromQuery] int? branch)
        {
            //set up time filter
            FilterDto myfilter = new FilterDto();
            myfilter.last_3_month();
            myfilter.BranchId = branch;
            //get return
            var finalReturn = getHourlyReport(myfilter);
            return Ok(finalReturn);
        }

        //this_year
        [HttpGet("this_year")]
        public IActionResult this_year([FromQuery] int? branch)
        {
            //set up time filter
            FilterDto myfilter = new FilterDto();
            myfilter.this_year();
            myfilter.BranchId = branch;
            //get return
            var finalReturn = getHourlyReport(myfilter);
            return Ok(finalReturn);
        }

        //last_year
        [HttpGet("last_year")]
        public IActionResult last_year([FromQuery] int? branch)
        {
            //set up time filter
            FilterDto myfilter = new FilterDto();
            myfilter.last_year();
            myfilter.BranchId = branch;
            //get return
            var finalReturn = getHourlyReport(myfilter);
            return Ok(finalReturn);
        }

        [AllowAnonymous]
        [HttpGet("DateRange")]
        public IActionResult DateRange([FromQuery] int? branch, [FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            if (start == null || end == null)
                return BadRequest(ModelState);
            //set up time filter
            FilterDto myfilter = new FilterDto();
            myfilter.Start = start;
            myfilter.End = end.AddDays(1);
            myfilter.BranchId = branch;
            //get return
            var finalReturn = getHourlyReport(myfilter);
            return Ok(finalReturn);
        }

        public List<List<HourlyReportDto>> getHourlyReport([FromBody] FilterDto myfilter)
        {

            var invoicesList = _context.Invoice
                .Where(i => myfilter.BranchId == null ? true : i.Branch == myfilter.BranchId)
                .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)
                .Select(i => new { i.InvoiceNumber,i.Branch,i.CommitDate }).ToList();

            var days = myfilter.End.Subtract(myfilter.Start).TotalDays;

            var transList = _context.TranInvoice.Select
                (ti => new
                {
                    ti.TranId,
                    ti.invoice_number,
                    ti.AmountApplied
                })
                .Join(
                invoicesList,
                ti => ti.invoice_number,
                i => i.InvoiceNumber,
                (ti, i) => new
                {
                    invoice_number = i.InvoiceNumber,
                    tran_id = ti.TranId,
                    i.CommitDate,
                    amountApplied = ti.AmountApplied,
                    i.Branch
                });


            var HourlyReports = (from i in transList
                                group i by i.CommitDate.Hour into g
                                select new HourlyReportDto
                                {
                                    hour = g.Key,
                                    amount = Math.Round((from a in g
                                                         select a.amountApplied).Sum()/ (from a in g
                                                                                         select a.invoice_number).Count(), 2),
                                    transaction = Math.Round((from a in g
                                                   select a.invoice_number).Count()/days,2),
                                    total_amount = Math.Round((from a in g
                                                               select a.amountApplied).Sum(),2),
                                    total_transaction = (from a in g
                                                         select a.invoice_number).Count()

                                }).ToList();

            decimal total_amount_overall=0;
            decimal total_transaction_overall =0;

            foreach (var i in HourlyReports)
            {
                total_amount_overall = total_amount_overall + i.total_amount ;
                total_transaction_overall = total_transaction_overall + (decimal)i.total_transaction;
            }
            var total_amount_per_day = Math.Round(total_amount_overall / (decimal)days,2);
            var total_transaction_per_day = Math.Round((double)total_transaction_overall / days, 2);

            List<HourlyReportDto> finalHourlyReports = new List<HourlyReportDto>();


                for (int i = 0; i < 24; i++)
                {
                var new_hourReport = new HourlyReportDto
                {
                    hour = i + 1,
                    amount = 0,
                    transaction = 0,
                    total_amount = total_amount_per_day,
                    total_transaction = total_transaction_per_day
                    };
                    finalHourlyReports.Add(new_hourReport);
                }

            foreach (var fr in finalHourlyReports)
            {
                foreach (var r in HourlyReports)
                {
                    if (fr.hour == r.hour + 1)
                    {
                        fr.amount = r.amount;
                        fr.transaction = r.transaction;
                        //fr.total_amount = total_amount_per_day;// r.total_amount;
                        //fr.total_transaction = total_transaction_per_day; // r.total_transaction;
                        break;
                    }
                }
                continue;
            }
            var returnList = (from i in finalHourlyReports
                              select i).ToList().OrderBy(i=>i.hour).ToList();

            var rushhour = (from i in finalHourlyReports
                               select i).ToList().OrderByDescending(i => i.transaction).Take(3).ToList();

            List<List<HourlyReportDto>> finallist = new List<List<HourlyReportDto>>(){ returnList, rushhour };

            return finallist;

        }

    }
}