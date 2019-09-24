using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class CatAddDto
    {
        public int id { get; set; }
        public int parent_id { get; set; } = 0;
        public string cat { get; set; }
        public int layer_level { get; set; }
    }
}
