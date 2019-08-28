using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SB.Entities
{
    public class ItemToCategory
    {
        public int Id { get; set; }
        public int itemId { get; set; }
        public int CategoryId { get; set; }

        [ForeignKey("itemId")]
        public Item item { get; set; }
        [ForeignKey("CategoryId")]
        public Category category { get; set; }

    }
}
