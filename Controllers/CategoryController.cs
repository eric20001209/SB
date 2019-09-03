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
            var finalList = new List<CategoryDto>();
            var tempList = new List<CategoryDto>();

            foreach (var cat in mylist)
            {
                CategoryDto currentNode = new CategoryDto(); 
                currentNode.Id = cat.id;
                currentNode.Description = cat.description;
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
                    LoopToAppendSubCat(tempList, item);
                    finalList.Add(item);
                }

            }
            return Ok(finalList);
        }
        public void LoopToAppendSubCat(List<CategoryDto> all, CategoryDto currentCat)
        {
            var subItems = all.Where(ee => ee.Parent_Id == currentCat.Id).ToList();
            currentCat.SubCategories = new List<CategoryDto>();
            currentCat.SubCategories.AddRange(subItems);
            foreach (var subItem in subItems)
            {
                LoopToAppendSubCat(all, subItem);
            }
        }
    }
}