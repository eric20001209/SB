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
    [Route("api/item")]
    [ApiController]
    public class ItemReportController : ControllerBase
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

        [AllowAnonymous]
        [HttpGet("cat")]
        public IActionResult getCategories()
        {
            var categries = _context.Sales
                .Where(c => c.Cat.Trim().ToLower() != "serviceitem")
                .Where(c => c.Cat.Trim().ToLower() != "service fee")
                .Where(c => c.Cat.Trim().ToLower() != "whole sale")
                .Where(c => c.Cat.Trim().ToLower() != "")
                .Where(c => c.Cat.Trim().ToLower() != null)
                .Select(c=>new { c.Cat})
                .GroupBy(c=>c.Cat.Trim())
                .Select(group => group.First()).ToList();
            return Ok(categries);
        }

        [HttpGet("item")]
        public IActionResult getCategoryitems([FromQuery] string cat)
        {
            var Categoryitems = _context.Sales
                .Where(c => cat == null? true : c.Cat == cat)
                .Select(s => new { s.Code })
                .Join(_context.CodeRelations.Select(c => new { c.Code, c.NameCn }),
                s => s.Code,
                c => c.Code,
                (s, c) => new { s.Code, Name = c.NameCn }).GroupBy(c => c.Code)
                .Select(g => g.FirstOrDefault()).ToList() ;
            return Ok(Categoryitems);
        }

        [HttpGet()]
        public IActionResult getItemReport([FromQuery] int? branch, [FromQuery] DateTime start, [FromQuery] DateTime end, [FromQuery] string cat, [FromQuery] int? code, [FromQuery] string type)
        {
            //setup filter
            var myfilter = new ItemReportFilterDto();
            myfilter.BranchId = branch;
            myfilter.Start = start;
            myfilter.End = end;
            myfilter.cat = cat;
            myfilter.code = code;

            //get return list
            return Ok(createItemReport(myfilter, type));
        }

        public List<ItemReportDto> createItemReport(ItemReportFilterDto myfilter, string type)
        {
            var myinvoicelist = _context.Invoice
                .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)
                .Where(i => myfilter.BranchId == null ? true : i.Branch == myfilter.BranchId)
                .Select(i => new { i.InvoiceNumber, i.Branch,i.CommitDate })
                .Join(
                    _context.Branch
                    .Where(b => b.Activated == true)
                    .Select(b => new { b.Name, b.Id }),
                    i => i.Branch,
                    b => b.Id,
                    (i, b) => new { i.InvoiceNumber,i.CommitDate, b.Name }
                    );
 
           var myitemlist = (from i in myinvoicelist
                              join s in _context.Sales
                             .Where(s => s.Cat.Trim().ToLower() != "serviceitem")
                             .Where(s => s.Cat.Trim().ToLower() != "")
                             .Where(s => myfilter.cat == null ? true : s.Cat == myfilter.cat)
                             .Where(s => myfilter.code == null ? true : s.Code == myfilter.code)
                             .Select(s => new
                             {
                                 s.InvoiceNumber,
                                 s.Name,
                                 s.Code,
                                 s.Cat,
                                 s.CommitPrice,
                                 s.Quantity,
                                 s.TaxRate,
                                 s.SupplierPrice
                             }) on i.InvoiceNumber equals s.InvoiceNumber
                              join c in _context.CodeRelations on s.Code equals c.Code
                              select new
                              {
                                  i.CommitDate,
                                  Name = c.NameCn,  
                                  s.Code,
                                  s.Cat,
                                  s.CommitPrice,
                                  s.Quantity,
                                  s.TaxRate,
                                  s.SupplierPrice
                              }).ToList();

            var myreturnlist = new List<ItemReportDto>();

            if (type == "OneItem")
            {
                myreturnlist = (from i in myitemlist
                                group i by i.CommitDate.Month.ToString() into g
                                select new ItemReportDto
                                {
                                    key = g.Key,

                                    code = myfilter.code,

                                    description = (from i in g
                                                   select i.Name).FirstOrDefault(),
                                    qty = (from i in g
                                           select i.Quantity).Sum(),
                                    sales = Math.Round((from i in g
                                                        select (double)i.CommitPrice * (1 + i.TaxRate) * i.Quantity).Sum().Value, 2),
                                    profit = Math.Round((from i in g
                                                         select (double)(i.CommitPrice - i.SupplierPrice) * (1 + i.TaxRate) * i.Quantity).Sum().Value, 2),

                                }).ToList();
            }
            else if (type == "CategoryItem")
            {
                myreturnlist = (from i in myitemlist
                                group i by i.Code into g
                                select new ItemReportDto
                                {
                                    code = g.Key,
                                    description = (from i in g
                                                   select i.Name).FirstOrDefault(),
                                    qty = (from i in g
                                           select i.Quantity).Sum(),
                                    sales = Math.Round((from i in g
                                                        select (double)i.CommitPrice * (1 + i.TaxRate) * i.Quantity).Sum().Value, 2),
                                    profit = Math.Round((from i in g
                                                         select (double)(i.CommitPrice - i.SupplierPrice) * (1 + i.TaxRate) * i.Quantity).Sum().Value, 2),

                                }).ToList();
            }
            else if (type == "OneCategory")
            {

            }
            else if (type == "AllCategory")
            {

            }


            return myreturnlist;
            //var myitemlist = myinvoicelist.Select(i=>i)
            //    .Join(
            //    _context.Sales
            //    .Where(s => s.Cat.Trim().ToLower() != "serviceitem")
            //    .Where(s => myfilter.cat != null ? s.Cat.Trim().ToLower() == myfilter.cat.Trim().ToLower(): true)
            //    .Where(s => myfilter.code != null ? s.Code.ToString() == myfilter.code : true)
            //    .Select(s => new {
            //        s.InvoiceNumber,
            //        s.Code, 
            //        s.Cat,
            //        s.CommitPrice,
            //        s.Quantity,
            //        s.TaxRate,
            //        s.SupplierPrice}),
            //    i=>i.InvoiceNumber,
            //    s => s.InvoiceNumber,
            //    (i,s) => new {
            //        s.Code,
            //        s.Cat,
            //        s.CommitPrice,
            //        s.Quantity,
            //        s.TaxRate,
            //        s.SupplierPrice
            //    }).ToList()
            //    .Join(_context.CodeRelations.Select(c=> new { c.Code, c.Name, c.NameCn}),
            //    s=>s.Code,
            //    c=>c.Code,
            //    (s,c) => new {
            //        c.Name,
            //        s.Code,
            //        s.Cat,
            //        s.CommitPrice,
            //        s.Quantity,
            //        s.TaxRate,
            //        s.SupplierPrice
            //    })
            //    .GroupBy(s=>s.Code);


        }
    }
}