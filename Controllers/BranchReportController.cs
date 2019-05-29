using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Data;
using Microsoft.AspNetCore.Authorization;

namespace SB.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BranchReportController : ControllerBase
    {
        wucha_cloudContext _context = new wucha_cloudContext();

        [HttpPost("BranchReport/{id}")]
        public IActionResult getBranchReport(int id)
        {
            return Ok();
        }
    }
}