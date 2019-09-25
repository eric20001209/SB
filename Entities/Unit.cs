using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Entities
{
    public class Unit
    {
        public int id { get; set; }
        public string unit { get; set; }
        public double quantity { get; set; }

        //public ICollection<Item> items { get; set; } = new List<Item>();
    }
}
