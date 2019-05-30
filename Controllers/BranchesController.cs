using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SB.Data;

namespace SB.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BranchesController : ControllerBase
    {
        private readonly wucha_cloudContext _context = new wucha_cloudContext();

        [AllowAnonymous]
        [HttpGet()]
        public IActionResult GetBranches()
        {
            var BranchList = _context.Branch.Where(i => i.Activated == true)
                .Select(i=>new {
                    i.Id,
                    i.Name,
                    i.City
                }).ToList();
            return Ok(BranchList);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult GetBranch(int? id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var branch = _context.Branch
                .Where(i => i.Activated == true)
                .Where(i => id.ToString() != null ? i.Id == id : true)
                .Select(i => new
                {
                    i.Id,
                    i.Name,
                    i.City
                }).FirstOrDefault();

            if (branch == null)
            {
                return NotFound();
            }
            return Ok(branch);
        }

    }
}