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

        [HttpPost("addItem")]
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
            item.unitid = newItem.unitid;
            item.categoryid = newItem.categoryid;

            _context.Add(item);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("addBarcode/{id}")]
        public IActionResult addBarcode(int id, [FromBody] List<AddBarcodeDto> newBarcodes)
        {
            if (newBarcodes == null)
                return BadRequest();
            
            List<Barcode> BarcodeToInputList = new List<Barcode>();
            Barcode BarcodeToInput = new Barcode();

            foreach (var newBarcode in newBarcodes)
            {
                BarcodeToInput.code = newBarcode.code;
                BarcodeToInput.barcode = newBarcode.barcode;
                BarcodeToInput.itemId = id;

                if (_context.Barcode.Any(b=>b.barcode == BarcodeToInput.barcode))
                {
                    continue;
                }

            }
            return Ok();
        }

        [HttpGet("{id}")]
        public IActionResult getItem(int id)
        {
            var item = _context.Item.Where(i => i.id == id).FirstOrDefault();
            if (item == null)
                return BadRequest();

            return Ok(item);
        }




    }
}