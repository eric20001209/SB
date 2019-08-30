using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Data;

namespace SB.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private wucha_cloudContext _context = new wucha_cloudContext();

        [HttpGet("list")]
        public IActionResult getCategroyList([FromQuery] int? parentId)
        {
            if (!parentId.HasValue)
                parentId = 0;
            var mylist = _context.Category.Select(c=> new {c.id,c.description,c.active,c.parent_id }).Where(c=>c.parent_id == parentId)
                .OrderBy(c=>c.description);
            return Ok(mylist);
        }
    }
}