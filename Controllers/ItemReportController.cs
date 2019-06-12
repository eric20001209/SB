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
            var categries = _context.CodeRelations
                .Where(c => c.Cat.Trim().ToLower() != "serviceitem")
                .Where(c => c.Cat.Trim().ToLower() != "service fee")
                .Where(c => c.Cat.Trim().ToLower() != "whole sale")
                .Where(c => c.Cat.Trim().ToLower() != "")
                .Select(c=>new { c.Cat})
                .GroupBy(c=>c.Cat.Trim())
                .Select(group => group.First()).ToList();
            return Ok(categries);
        }

        [HttpGet("scat/{cat}")]
        public IActionResult getSubCategories(string cat)
        {
            var subcategries = _context.CodeRelations
                .Where(c=>c.Cat.Trim() ==cat.Trim())
                //.Where(c => c.Cat.Trim().ToLower() != "serviceitem")
                //.Where(c => c.Cat.Trim().ToLower() != "service fee")
                //.Where(c => c.Cat.Trim().ToLower() != "whole sale")
                //.Where(c => c.Cat.Trim().ToLower() != "")
                .Select(c => new { c.SCat })
                .GroupBy(c => c.SCat.Trim())
                .Select(group => group.First()).ToList();
            return Ok(subcategries);
        }

        [HttpGet()]
        public IActionResult getItemReport([FromQuery] int branch, [FromQuery] DateTime start, [FromQuery] DateTime end, [FromQuery] string cat, [FromQuery] string code )
        {
            //setup filter
            var myfilter = new ItemReportFilterDto();
            myfilter.BranchId = branch;
            myfilter.Start = start;
            myfilter.End = end;
            myfilter.cat = cat;
            myfilter.code = code;

            //get return list
            return Ok(createItemReport(myfilter));
        }

        public List<ItemReportDto> createItemReport(ItemReportFilterDto myfilter)
        {
            List<ItemReportDto> mylist = new List<ItemReportDto>();
            return mylist;
        }
    }
}