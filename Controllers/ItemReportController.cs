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
    [Route("api/Item")]
    [ApiController]
    public class ItemReportController : ControllerBase
    {
        wucha_cloudContext _context = new wucha_cloudContext();

        [HttpGet()]
        public IActionResult getItemReport([FromQuery] int? branch, [FromQuery] string keyword, [FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            if (start == null || end == null)
                return BadRequest(ModelState);
            // set up filter
            ItemReportFilterDto myfilter = new ItemReportFilterDto();
            myfilter.BranchId = branch;
            myfilter.keyword = keyword;
            myfilter.Start = start;
            myfilter.End = end;

            //get return list
            return Ok(CreateItemReport(myfilter));
        }


        public List<ItemReportDto> CreateItemReport([FromBody] ItemReportFilterDto myfilter)
        {
            List<ItemReportDto> myReport = new List<ItemReportDto>();

            var test = (from b in _context.Branch.Where(b => myfilter.BranchId == null ? true :  b.Id ==  myfilter.BranchId)
                        join i in _context.Invoice
                        .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                        .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)
                        on b.Id equals i.Branch
                        join s in _context.Sales on i.InvoiceNumber equals s.InvoiceNumber
                        select new {
                            s.Code,
                            s.Cat,
                            s.SCat,
                            s.SsCat,
                            s.CommitPrice,
                            s.TaxRate,
                            s.InvoiceNumber,
                            b.Id,
                            b.Name
                        }
                        ).ToList();

            var list = (from i in test
                       group i by i.Name into g
                       select g).ToList();


            var InvoiceList_branch_first =
                _context.Branch
                .Where(b => myfilter.BranchId == null ? true : b.Id == myfilter.BranchId)

                .Select(b => new { branchName = b.Name, branchId = b.Id })
                .Join(
                    _context.Invoice
                        .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                        .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)

                        .Select(i => new { branchId = i.Branch, i.InvoiceNumber }),
                    b => b.branchId,
                    i => i.branchId,
                    (b, i) => new { b.branchId, b.branchName, i.InvoiceNumber }
                    );


            var InvoiceList_invoice_first = _context.Invoice
                .Where(i => myfilter.BranchId == null ? true : i.Branch == myfilter.BranchId)
                .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)

                .Select(i => new { branchId = i.Branch, i.InvoiceNumber })
                .Join(
                _context.Branch
                .Select(b => new { branchName = b.Name, branchId = b.Id }),
                i => i.branchId,
                b => b.branchId,
                (i, b) => new { b.branchId, b.branchName, i.InvoiceNumber }
                );

            var mylist = 

                InvoiceList_branch_first
        //      InvoiceList_invoice_first
                .Join(
                _context.Sales
                .Select(s => new
                {
                    s.Code,
                    s.Cat,
                    s.SCat,
                    s.SsCat,
                    s.CommitPrice,
                    s.TaxRate,
                    s.InvoiceNumber
                }),
                bi => bi.InvoiceNumber,
                s => s.InvoiceNumber,
                (bi, s) => new
                {
                    s.Code,
                    s.Cat,
                    s.SCat,
                    s.SsCat,
                    s.CommitPrice,
                    s.TaxRate,
                    s.InvoiceNumber,
                    bi.branchId,
                    bi.branchName
                }).GroupBy(bi => bi.branchName);

            return myReport;
        }
    }
}