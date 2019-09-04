using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.CompilerServices;
using SB.Data;
using SB.Dto;

namespace SB.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private wucha_cloudContext _context = new wucha_cloudContext();

        [HttpGet("list")]
        public IActionResult getCategroyList()
        {
            var mylist = _context.Category.Select(c=> new {
                c.id,
                c.description,
                c.active,
                c.parent_id
            })
                .OrderBy(c=>c.description);

            //declare a final list
            var finalList = new List<CategorySelect2Dto>();
            var tempList = new List<CategorySelect2Dto>();

            foreach (var cat in mylist)
            {
                CategorySelect2Dto currentNode = new CategorySelect2Dto(); 
                currentNode.id = cat.id;
                currentNode.text = cat.description;
                currentNode.Active = cat.active;
                currentNode.Parent_Id = cat.parent_id;
                tempList.Add(currentNode);


            }

            //var root = new CategoryDto();
            //LoopToAppendSubCat(tempList, root);

            foreach (var item in tempList)
            {
                if (item.Parent_Id == 0)
                {
                    LoopToAppendSubCat(tempList, item );
                    finalList.Add(item);
                }
            }

            return Ok(finalList);
        }
        public void LoopToAppendSubCat(List<CategorySelect2Dto> all, CategorySelect2Dto currentCat )
        {
            var subItems = all.Where(ee => ee.Parent_Id == currentCat.id).ToList();
            currentCat.inc = new List<CategorySelect2Dto>();
            currentCat.inc.AddRange(subItems);

            foreach (var subItem in subItems)
            {
                LoopToAppendSubCat(all, subItem);
            }
        }

        [HttpGet("catList")]
        public IActionResult getCategroyList([FromQuery] int? parentId)
        {
            if (parentId == null)
                parentId = 0;
            var mylist = _context.Category.Select(c => new {
                Id = c.id,
                Description = c.description,
                Active = c.active,
                Parent_Id = c.parent_id
            })
                .Where(c =>c.Parent_Id == parentId)
                .OrderBy(c => c.Description);

            return Ok(mylist);
        }
    }
}