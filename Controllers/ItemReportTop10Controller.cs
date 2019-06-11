﻿using System;
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
    [Route("api/Itemtop10")]
    [ApiController]
    public class ItemReportTop10Controller : ControllerBase
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
            return Ok(createItemReport(myfilter));
        }


        public List<ItemReportTop10Dto> createItemReport([FromBody] ItemReportFilterDto myfilter)
        {
            List<ItemReportTop10Dto> myReport = new List<ItemReportTop10Dto>();

            var test = (from b in _context.Branch.Where(b => myfilter.BranchId == null ? true :  b.Id ==  myfilter.BranchId)
                        join i in _context.Invoice
                        .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
                        .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)
                        on b.Id equals i.Branch
                        join s in _context.Sales on i.InvoiceNumber equals s.InvoiceNumber
                        join c in _context.CodeRelations on s.Code equals c.Code
                        select new {
                            //s.Code,
                            Name = c.NameCn,
                            s.Quantity,
                            //s.Cat,
                            //s.SCat,
                            //s.SsCat,
                            //s.CommitPrice,
                            //s.TaxRate,
                            //s.InvoiceNumber,
                            //BranchId = b.Id,
                            //BranchName = b.Name
                        }).ToList();

            myReport = (from i in test
                        group i by i.Name into g
                        select new ItemReportTop10Dto {
                            description = g.Key,
                            quantity = (from i in g
                                        select i.Quantity).Sum()

                        }).OrderByDescending(i=>i.quantity).Take(10).OrderBy(i=>i.quantity).ToList();


            //var InvoiceList_branch_first =
            //    _context.Branch
            //    .Where(b => myfilter.BranchId == null ? true : b.Id == myfilter.BranchId)

            //    .Select(b => new { branchName = b.Name, branchId = b.Id })
            //    .Join(
            //        _context.Invoice
            //            .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
            //            .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)

            //            .Select(i => new { branchId = i.Branch, i.InvoiceNumber }),
            //        b => b.branchId,
            //        i => i.branchId,
            //        (b, i) => new { b.branchId, b.branchName, i.InvoiceNumber }
            //        );


            //var InvoiceList_invoice_first = _context.Invoice
            //    .Where(i => myfilter.BranchId == null ? true : i.Branch == myfilter.BranchId)
            //    .Where(i => myfilter.Start == null ? true : i.CommitDate >= myfilter.Start)
            //    .Where(i => myfilter.End == null ? true : i.CommitDate <= myfilter.End)

            //    .Select(i => new { branchId = i.Branch, i.InvoiceNumber })
            //    .Join(
            //    _context.Branch
            //    .Select(b => new { branchName = b.Name, branchId = b.Id }),
            //    i => i.branchId,
            //    b => b.branchId,
            //    (i, b) => new { b.branchId, b.branchName, i.InvoiceNumber }
            //    );

            //var mylist_branch_first =
            //        InvoiceList_branch_first
            //        .Join(
            //    _context.Sales
            //    .Select(s => new
            //    {
            //        s.Code,
            //        s.Cat,
            //        s.SCat,
            //        s.SsCat,
            //        s.CommitPrice,
            //        s.TaxRate,
            //        s.InvoiceNumber
            //    }).ToList(),
            //    bi => bi.InvoiceNumber,
            //    s => s.InvoiceNumber,
            //    (bi, s) => new
            //    {
            //        s.Code,
            //        s.Cat,
            //        s.SCat,
            //        s.SsCat,
            //        s.CommitPrice,
            //        s.TaxRate,
            //        s.InvoiceNumber,
            //        bi.branchId,
            //        bi.branchName
            //    }).GroupBy(bi => bi.branchName);


            //var mylist_invoice_first = 
            //        InvoiceList_invoice_first
            //    .Join(
            //    _context.Sales
            //    .Select(s => new
            //    {
            //        s.Code,
            //        s.Cat,
            //        s.SCat,
            //        s.SsCat,
            //        s.CommitPrice,
            //        s.TaxRate,
            //        s.InvoiceNumber
            //    }),
            //    bi => bi.InvoiceNumber,
            //    s => s.InvoiceNumber,
            //    (bi, s) => new
            //    {
            //        s.Code,
            //        s.Cat,
            //        s.SCat,
            //        s.SsCat,
            //        s.CommitPrice,
            //        s.TaxRate,
            //        s.InvoiceNumber,
            //        bi.branchId,
            //        bi.branchName
            //    }).GroupBy(bi => bi.branchName);

            return myReport;
        }
    }
}