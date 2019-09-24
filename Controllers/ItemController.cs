using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Dto;
using SB.Data;
using SB.Models;

namespace SB.Controllers
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly wucha_cloudContext _context = new wucha_cloudContext();

        [HttpPost()]
        public IActionResult addItem([FromBody] ItemDto newItem)
        {
            if (newItem == null)
                return BadRequest();

            var maxCode = _context.CodeRelations.OrderByDescending(c => c.Code).Take(1).FirstOrDefault().Code;
            newItem.code = maxCode;

            CodeRelations codeRelations = new CodeRelations();
            codeRelations.Code = newItem.code;
            codeRelations.Name = newItem.name;
            codeRelations.NameCn = newItem.name_cn;
            codeRelations.Price1 = newItem.price;
            codeRelations.SupplierPrice = newItem.cost;
            

            return Ok();
        }

        [HttpGet("category/{id}")]
        public IActionResult getItemList(string id)
        {

            return Ok();
        }
    }
}