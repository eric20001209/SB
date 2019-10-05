using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.CompilerServices;
using SB.Data;
using SB.Dto;
using SB.Entities;

namespace SB.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private wucha_cloudContext _context = new wucha_cloudContext();
        int loopCount = 1;
        bool jumpOut = false;
        List<int> mylist = new List<int>();

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

            return Ok(finalList.ToList());
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

        [HttpGet()]
        public IActionResult catalogList()
        {
            var mylist = _context.Category.Select(c => new
            {
                id = c.id,
                pId = c.parent_id,
                name = c.description,
                level = c.layer_level
            });
            return Ok(mylist);
        }

        [HttpPost("add")]
        public IActionResult addcat([FromBody] CatAddDto newCat)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            Category catalog = new Category();

            //          newCat.parent_id = 0; //root node
            var parent_id = newCat.parent_id;
            var cat = newCat.cat;
            bool existCat = _context.Category.Any(c => c.parent_id == parent_id && c.description == cat);
            if (existCat)
                return BadRequest("Sorry, this Category exists already!!!");

            catalog.parent_id = parent_id;
            catalog.description = cat;
            var level = getLevel(parent_id, jumpOut);
            //          if(jumpOut)
            catalog.layer_level = loopCount;
            loopCount = 1;
            jumpOut = false;

            _context.Category.Add(catalog);
            _context.SaveChanges();

            return Ok(catalog);
        }

        [HttpDelete("del")]
        public IActionResult delcat([FromQuery] int id)
        {
            Category delcat = new Category();
            //CodeRelations updateItem = new CodeRelations();
            //List<CodeRelations> affectedItems = new List<CodeRelations>();

            delcat = _context.Category.Where(c => c.id == id).FirstOrDefault();
            var affectedCatLevel = delcat.layer_level;
            if (delcat == null)
                return NotFound();
            if (delcat != null)
            {
                _context.Remove(delcat);
                _context.SaveChanges();
            }
            return Ok(delcat);
        }

        [HttpPatch("edit")]
        public IActionResult editcat([FromQuery] int id, [FromBody] JsonPatchDocument<CatUpdateDto> patchDoc)
        {
            if (patchDoc == null)
                return BadRequest();

            var catToUpdate = _context.Category.Where(c => c.id == id).FirstOrDefault();
            if (catToUpdate == null)
                return NotFound();

            var catToPatch = new CatUpdateDto
            {
                id = catToUpdate.id,
                parent_id = catToUpdate.parent_id,
                cat = catToUpdate.description
            };



            patchDoc.ApplyTo(catToPatch, ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool existCat = _context.Category.Any(c => c.parent_id == catToPatch.parent_id && c.description == catToPatch.cat && c.id != catToPatch.id);
            if (existCat)
                return BadRequest("Sorry, this Category exists already!!!");

            catToUpdate.description = catToPatch.cat;


            ///update categories for affected items
            List<Item> affectedItems = new List<Item>();
            //var affectedCatLevel = catToUpdate.LayerLevel;
            //update categories for affected items
            //if (affectedCatLevel == 1)
            //{
            //    affectedItems = _context.CodeRelations.Where(cl => cl.Cat == catToUpdate.Cat).ToList();
            //    foreach (var item in affectedItems)
            //    {
            //        item.Cat = catToPatch.cat;
            //    }
            //}
            //else if (affectedCatLevel == 2)
            //{
            //    affectedItems = _context.CodeRelations.Where(cl => cl.SCat == catToUpdate.Cat).ToList();
            //    foreach (var item in affectedItems)
            //    {
            //        item.SCat = catToPatch.cat;
            //    }
            //}
            //else if (affectedCatLevel == 3)
            //{
            //    affectedItems = _context.CodeRelations.Where(cl => cl.SsCat == catToUpdate.Cat).ToList();
            //    foreach (var item in affectedItems)
            //    {
            //        item.SsCat = catToPatch.cat;
            //    }
            //}
            ///


            _context.SaveChanges();

            return NoContent();
        }

        //Recursive get LayerLevel
        private int getLevel(int pid, bool bGetLevel)
        {
            var upperNode = _context.Category.Where(cr => cr.id == pid).FirstOrDefault();

            if (upperNode == null)
                return loopCount;

            var upperLevelPid = _context.Category.Where(cr => cr.id == pid).FirstOrDefault().parent_id;


            if (pid == 0)
            {
                bGetLevel = true;
                return loopCount;

            }
            else if (upperLevelPid == 0)
            {
                bGetLevel = true;
                loopCount++;
                return loopCount;
            }
            else
            {
                loopCount++;
                getLevel(upperLevelPid, bGetLevel);
            }
            return loopCount;
        }

        [HttpGet("{id}")]
        public IActionResult getItemList(int id)
        {
            var catIdList = getRelatedCatIdList(id);
            var itemList = _context.Item
                .Where(i => catIdList.Contains(i.categoryid))
                .Join(_context.Category.Select(c => new { c.id, c.description }),
                (i => i.categoryid),
                (c => c.id),
                (i, c) => new { i.code, i.name, i.name_cn, c.description, i.price, i.cost }
                );

            return Ok(itemList);
        }

        public List<int> getRelatedCatIdList(int id)
        {
            if (mylist.Exists(i => i == id))
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