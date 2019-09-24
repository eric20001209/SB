using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SB.Entities
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public int parent_id { get; set; }
        public bool active { get; set; } = false;

        [Required(ErrorMessage = "You should input a category value.")]
        [MaxLength(50)]
        public string description { get; set; }
        public int? layer_level { get; set; } = 1;
        public ICollection<Item> items { get; set; } = new List<Item>();
    }
}
