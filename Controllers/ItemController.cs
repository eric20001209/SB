using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Dto;
using SB.Data;
using SB.Models;
using SB.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.JsonPatch;

namespace SB.Controllers
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly wucha_cloudContext _context = new wucha_cloudContext();
        List<CategoryDto> relateCategoryList = new List<CategoryDto>();
        List<int> mylist = new List<int>();

        [HttpPost("add")]
        public IActionResult addItem([FromBody] AddItemDto newItem)
        {
            if (newItem == null)
                return NotFound();

            Item item = new Item();
            item.code = newItem.code;
            item.name = newItem.name;
            item.name_cn = newItem.name_cn;
            item.price = newItem.price;
            item.cost = newItem.cost;
            //item.unitid = newItem.unitid;
            //item.categoryid = newItem.categoryid;

            _context.Add(item);
            _context.SaveChanges();

            return Ok(item);
        }

        [HttpDelete("remove")]
        public IActionResult removeItem([FromQuery] int id)
        {
            var itemToRemove = new Item();
            itemToRemove = _context.Item.Where(i => i.id == id).FirstOrDefault();

            if (itemToRemove == null)
                return BadRequest();
            _context.Remove(itemToRemove);
            _context.SaveChanges();
            return Ok(itemToRemove);
        }

        [HttpPatch("edit")]
        public IActionResult editItem([FromQuery] int id, [FromBody] JsonPatchDocument<ItemUpdateDto> patchDoc)
        {
            if (patchDoc == null)
                return BadRequest();
            var itemToUpdate = _context.Item.Where(i => i.id == id)
                //.Include(i=>i.barcodes)
                //.Select(x =>new
                //{
                //    x.code,
                //    x.name,
                //    x.name_cn,
                //    x.price,
                //    x.cost,
                //    x.unitid,
                //    x.categoryid,
                //    x.barcodes
                //})
                .FirstOrDefault();

            if (itemToUpdate == null)
                return NotFound();
            var itemToPatch = new ItemUpdateDto()
            {
                code = itemToUpdate.code,
                name = itemToUpdate.name,
                name_cn = itemToUpdate.name_cn,
                price = itemToUpdate.price,
                cost = itemToUpdate.cost,
                cat_id = itemToUpdate.categoryid
            };
            patchDoc.ApplyTo(itemToPatch, ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            itemToUpdate.code = itemToPatch.code;
            itemToUpdate.name = itemToPatch.name;
            itemToUpdate.name_cn = itemToPatch.name_cn;
            itemToUpdate.price = itemToPatch.price;
            itemToUpdate.cost = itemToPatch.cost;
            itemToUpdate.categoryid = itemToPatch.cat_id;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpGet("itemlist")]
        public IActionResult getItemList()
        {
            var itemList = (from i in _context.Item
                            .Include(i => i.barcodes)
                            join c in _context.Category on i.categoryid equals c.id into cat from c in cat.DefaultIfEmpty()
                            select new
                            {
                                i.id, i.code, i.name, i.name_cn, i.price, i.cost, i.categoryid,
                                cat = c.description,
                                i.barcodes
                            }).OrderByDescending(i => i.id);
            //_context.Item
            //.Include(i => i.barcodes)
            //.Select(x => new
            //{
            //    x.id,
            //    x.code,
            //    x.name,
            //    x.categoryid,
            //    x.name_cn,
            //    x.price,
            //    x.cost,
            //    x.barcodes
            //})
            //.Join(_context.Category
            //.Select(c => new { c.id, c.description }),
            //i => i.categoryid,
            //c => c.id,
            //(i, c) => new {
            //    i.id,
            //    i.code,
            //    i.name,
            //    i.name_cn,
            //    i.price,
            //    i.cost,
            //    cat = c == null ? "No Category":c.description,
            //    unit =""
            //})
            //.OrderByDescending(i=>i.id)
            //.ToList();

            if (itemList == null)
                return BadRequest();

            return Ok(itemList);
        }

        [HttpGet("item/{id}")]
        public IActionResult getItem(int id)
        {
            List<string> mylist = new List<string>();

            var item = _context.Item
              .Where(i => i.id == id)
                .Include(i => i.barcodes)
                .Select(x => new
                {
                    x.code, x.name, x.name_cn, x.price, x.cost, x.unitid, x.categoryid, x.barcodes
                }).FirstOrDefault();

            if (item == null)
                return BadRequest();

            return Ok(item);
        }

        [HttpGet("item/cat/{catid}")]
        public IActionResult getIteRelateCategory(int catid)
        {
            //var catlist = _context.Category.Where(c => c.id == catid).ToList();
            //if (catlist == null)
            //    return BadRequest();
            var catlist = getRelatedCategoryList(catid); //getRelatedCatIdList(catid);
            return Ok(catlist);
        }

        public List<int> getRelatedCatIdList(int id)
        {
            var parent_id = _context.Category.Where(c => c.id == id).FirstOrDefault().parent_id;

            if (mylist.Exists(i => i == id))
            {
            }
            else
                mylist.Add(id);

            var parentCat = _context.Category.Where(c => c.id == parent_id);
            if (parentCat == null)
                return mylist;
            foreach (var item in parentCat)
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
        public List<CategoryDto> getRelatedCategoryList(int id)
        {
            var category = _context.Category
                .Where(c => c.id == id)
                .Select(c => new CategoryDto { Id = c.id, Description = c.description, Parent_Id = c.parent_id, LayerLevel = c.layer_level })
                .FirstOrDefault();

            var parent_id = _context.Category.Where(c => c.id == id).FirstOrDefault().parent_id;
            if (relateCategoryList.Exists(i => i.Id == id))
            {
            }
            else
                relateCategoryList.Add(category);

            var parentCat = _context.Category.Where(c => c.id == parent_id)
                .Select(c => new CategoryDto { Id = c.id, Description = c.description, Parent_Id = c.parent_id, LayerLevel = c.layer_level });
            if (parentCat == null)
                return relateCategoryList;
            foreach (var item in parentCat)
            {
                if (relateCategoryList.Exists(i => i.Id == item.Id))
                {
                }
                else
                {
                    relateCategoryList.Add(item);
                    getRelatedCategoryList(item.Id);
                }
            }

            var final = relateCategoryList.OrderBy(c => c.LayerLevel).ToList();
            return final;
        }

        [HttpGet("barcodeList/{itemId}")]
        public IActionResult barcodeList(int itemId)
        {
            var barcodes = new List<BarcodeDto>();
            var barcodeList = _context.Barcode.Where(b => b.itemId == itemId).ToList();

            if (barcodeList == null)
                return NotFound();


            foreach (var b in barcodeList)
            {
                var barcode = new BarcodeDto();
                barcode.id = b.id;
                barcode.itemId = b.itemId;
                barcode.barcode = b.barcode;

                barcodes.Add(barcode);
            }

            return Ok(barcodes);
        }

        [HttpPost("addBarcode/{itemId}")]
        public IActionResult addBarcode(int itemId, [FromBody] AddBarcodeDto newBarcode)
        {
            if (newBarcode == null || newBarcode.barcode == "")
                return BadRequest();
            Barcode BarcodeToInput = new Barcode();

            BarcodeToInput.barcode = newBarcode.barcode;
            BarcodeToInput.itemId = itemId;

            if (_context.Barcode.Any(b => b.barcode == BarcodeToInput.barcode)) //check if this barcode exists
            {
                return BadRequest("Barcode exists!");
            }
            _context.Barcode.Add(BarcodeToInput);
            
            _context.SaveChanges(); //update db

            return Ok(BarcodeToInput);
        }

        [HttpPatch("updateBarcode/{id}")]
        public IActionResult updateBarcode(int id, [FromBody] JsonPatchDocument<BarcodeDto> patchDoc)
        {
            if (patchDoc == null)
                return BadRequest();
            var barcodeToUpdate = _context.Barcode.Where(b => b.id == id).FirstOrDefault() ;
            if (barcodeToUpdate == null)
                return NotFound();
            var barcodeToPatch = new BarcodeDto()
            {
                id = barcodeToUpdate.id,
                itemId = barcodeToUpdate.itemId,
                barcode = barcodeToUpdate.barcode 
            };
            patchDoc.ApplyTo(barcodeToPatch, ModelState);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (_context.Barcode.Any(b => b.barcode == barcodeToPatch.barcode && b.itemId != barcodeToPatch.itemId))
                return BadRequest("this barcode exists！");

            barcodeToUpdate.barcode = barcodeToPatch.barcode;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("deleteBarcode/{id}")]
        public IActionResult deleteBarcode(int id)
        {
            var barcodeToDelete = _context.Barcode.Where(b => b.id == id).FirstOrDefault();
            if (barcodeToDelete == null)
                return NotFound("barcode not found!");

            _context.Remove(barcodeToDelete);
            _context.SaveChanges();
            return Ok(barcodeToDelete);
        }





    }
}