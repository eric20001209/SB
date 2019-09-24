using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class CatUpdateDto
    {
        public int id { get; set; }
        public int parent_id { get; set; }
        public string cat { get; set; }
    }
}
