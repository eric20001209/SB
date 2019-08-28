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
        public int? parent_id { get; set; }
        public bool active { get; set; } = false;
        [Required]
        [MaxLength(50)]
        public string desciption { get; set; }
        public ICollection<Item> items { get; set; }
    }
}
