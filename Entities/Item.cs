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

        public int categoryid { get; set; }
        public int unitid { get; set; }

        //[ForeignKey("Unitid")]
        //public int Unitid { get; set; }
        //public Unit Unit;

        //[ForeignKey("Categoryid")]
        //public int Categoryid { get; set; }
        //public Category Category { get; set; }

        public ICollection<Barcode> barcodes { get; set; }
    }
}
