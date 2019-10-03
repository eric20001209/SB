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


namespace SB.Controllers
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly wucha_cloudContext _context = new wucha_cloudContext();

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

        [HttpPost("addBarcode/{id}")]
        public IActionResult addBarcode(int id, [FromBody] List<AddBarcodeDto> newBarcodes)
        {
            if (newBarcodes == null)
                return BadRequest();


            Barcode BarcodeToInput = new Barcode();

            foreach (var newBarcode in newBarcodes)
            {
                BarcodeToInput.code = newBarcode.code;
                BarcodeToInput.barcode = newBarcode.barcode;
                BarcodeToInput.itemId = id;

                if (_context.Barcode.Any(b => b.barcode == BarcodeToInput.barcode)) //check if this barcode exists
                {
                    continue;
                }
                _context.Barcode.Add(BarcodeToInput);
            }
            _context.SaveChanges(); //update db

            return Ok();
        }

        [HttpGet("itemlist")]
        public IActionResult getItemList()
        {
            var itemList = (from i in _context.Item
                           //join c in _context.Category on i.categoryid equals c.id
                           select new
                            {
                                i.id, i.code, i.name, i.name_cn, i.price,i.cost,
                            }).OrderByDescending(i=>i.id);
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

        [HttpGet("{id}")]
        public IActionResult getItem(int id)
        {
            List<string> mylist = new List<string>();

            var item = _context.Item
              .Where(i => i.id == id)
                .Include(i => i.barcodes)
                .Select(x => new
                {
                    x.code, x.name, x.name_cn, x.price, x.cost, x.barcodes
                }).FirstOrDefault();

            if (item == null)
                return BadRequest();

            return Ok(item);
        }




    }
}