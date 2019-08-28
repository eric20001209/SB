using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SB.Entities
{
    public class Barcode
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public int code { get; set; }
        public string barcode { get; set; }

        [ForeignKey("itemId")]
        public Item item { get; set; }
        public int itemId { get; set; }
    }
}
