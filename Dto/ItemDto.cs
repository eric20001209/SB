using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class ItemDto
    {
        public int code { get; set; }
        public string name { get; set; }
        public string name_cn { get; set; }
        public decimal price { get; set;}
        public decimal cost { get; set; }
        public int cat_id { get; set; }

        public UnitDto unit;
        //public ICollection<CategoryDto> categries = new List<CategoryDto>();
        public ICollection<BarcodeDto> barcodes = new List<BarcodeDto>();

    }
}
