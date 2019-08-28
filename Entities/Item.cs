using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SB.Dto;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SB.Entities
{
    public class Item
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public int code { get; set; }
        public string name { get; set; }
        public string name_cn { get; set; }
        public decimal price { get; set; }
        public decimal cost { get; set; }

        public UnitDto unit;

        public ICollection<ItemToCategory> itc { get; set; } 

        public ICollection<BarcodeDto> barcodes { get; set; } = new List<BarcodeDto>();
    }
}
