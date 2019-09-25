using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Dto;
using SB.Data;
using SB.Models;
using Microsoft.EntityFrameworkCore;

namespace SB.Controllers
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly wucha_cloudContext _context = new wucha_cloudContext();

        List<int> mylist = new List<int>();

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
        public IActionResult getItemList(int id)
        {
            var catIdList = getRelatedCatIdList(id);
            var itemList = _context.Item
                .Where(i => catIdList.Contains(i.categoryid))
                .Join(_context.Category.Select(c => new { c.id, c.description}),
                (i=> i.categoryid),
                (c => c.id),
                (i, c) => new { i.code, i.name, i.name_cn, c.description, i.price, i.cost}
                )
                ;


            //            var itemList = ()
            //var itemList = _context.Item
            //    .Select(i=>new { code = i.code, name = i.name, name_cn = i.name_cn, price = i.price, cost = i.cost, category_id = i.category.id })
            //    .Join(_context.Category.Select(c => new { c.id }),
            //    (i => i.category_id),
            //    (c => c.id),
            //    (i, c) => new ItemDto { code = i.code, name = i.name, name_cn = i.name_cn, price = i.price, cost = i.cost }
            //    ).ToList();
            //               .Where(i => catIdList.Contains(i.category.id));

            return Ok(itemList) ;
        }

        public List<int> getRelatedCatIdList(int id)
        {
            if (mylist.Exists(i=>i == id))
            {
                
            }
            else
                mylist.Add(id);
            var subCat = _context.Category.Where(c => c.parent_id == id);
            if (subCat == null)
                return mylist;
            foreach (var item in subCat)
            {
                if (mylist.Exists(i => i == item.id))
                {

                }
                else
                {
                    mylist.Add(item.id);
                    getRelatedCatIdList(item.id);
                }

            }

            return mylist;
        }
    }
}