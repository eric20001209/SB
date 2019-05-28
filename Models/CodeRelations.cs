﻿using System;
using System.Collections.Generic;

namespace SB.Models
{
    public partial class CodeRelations
    {
        public string Id { get; set; }
        public int Code { get; set; }
        public string Supplier { get; set; }
        public string SupplierCode { get; set; }
        public decimal? SupplierPrice { get; set; }
        public decimal AverageCost { get; set; }
        public double Rate { get; set; }
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Cat { get; set; }
        public string SCat { get; set; }
        public string SsCat { get; set; }
        public bool? Hot { get; set; }
        public bool Skip { get; set; }
        public bool Clearance { get; set; }
        public string InventoryAccount { get; set; }
        public int? CostAccount { get; set; }
        public int? IncomeAccount { get; set; }
        public decimal? ForeignSupplierPrice { get; set; }
        public byte Currency { get; set; }
        public double? ExchangeRate { get; set; }
        public decimal NzdFreight { get; set; }
        public double LevelRate1 { get; set; }
        public double LevelRate2 { get; set; }
        public double LevelRate3 { get; set; }
        public double LevelRate4 { get; set; }
        public double LevelRate5 { get; set; }
        public double LevelRate6 { get; set; }
        public double? LevelRate7 { get; set; }
        public double? LevelRate8 { get; set; }
        public double? LevelRate9 { get; set; }
        public int QtyBreak1 { get; set; }
        public int? QtyBreak2 { get; set; }
        public int? QtyBreak3 { get; set; }
        public int? QtyBreak4 { get; set; }
        public int? QtyBreak5 { get; set; }
        public int? QtyBreak6 { get; set; }
        public int? QtyBreak7 { get; set; }
        public int? QtyBreak8 { get; set; }
        public int? QtyBreak9 { get; set; }
        public double QtyBreakDiscount1 { get; set; }
        public double? QtyBreakDiscount2 { get; set; }
        public double? QtyBreakDiscount3 { get; set; }
        public double? QtyBreakDiscount4 { get; set; }
        public double? QtyBreakDiscount5 { get; set; }
        public double? QtyBreakDiscount6 { get; set; }
        public double? QtyBreakDiscount7 { get; set; }
        public double? QtyBreakDiscount8 { get; set; }
        public double? QtyBreakDiscount9 { get; set; }
        public decimal? QtyBreakPrice1 { get; set; }
        public decimal? QtyBreakPrice2 { get; set; }
        public decimal? QtyBreakPrice3 { get; set; }
        public decimal? QtyBreakPrice4 { get; set; }
        public decimal? QtyBreakPrice5 { get; set; }
        public decimal? QtyBreakPrice6 { get; set; }
        public decimal? QtyBreakPrice7 { get; set; }
        public decimal? QtyBreakPrice8 { get; set; }
        public decimal? QtyBreakPrice9 { get; set; }
        public decimal? QtyBreakPrice10 { get; set; }
        public decimal ManualCostFrd { get; set; }
        public double ManualExchangeRate { get; set; }
        public decimal ManualCostNzd { get; set; }
        public int AllocatedStock { get; set; }
        public bool IsService { get; set; }
        public decimal Rrp { get; set; }
        public byte? Promotion { get; set; }
        public byte? ComingSoon { get; set; }
        public double? Weight { get; set; }
        public byte? Inactive { get; set; }
        public string StockLocation { get; set; }
        public bool? Popular { get; set; }
        public bool RealStock { get; set; }
        public int Disappeared { get; set; }
        public decimal Price1 { get; set; }
        public decimal Price2 { get; set; }
        public decimal Price3 { get; set; }
        public decimal Price4 { get; set; }
        public decimal Price5 { get; set; }
        public decimal Price6 { get; set; }
        public decimal Price7 { get; set; }
        public decimal Price8 { get; set; }
        public decimal Price9 { get; set; }
        public decimal LevelPrice0 { get; set; }
        public decimal LevelPrice1 { get; set; }
        public decimal LevelPrice2 { get; set; }
        public decimal LevelPrice3 { get; set; }
        public decimal LevelPrice4 { get; set; }
        public decimal LevelPrice5 { get; set; }
        public decimal LevelPrice6 { get; set; }
        public decimal BasePrice { get; set; }
        public decimal PriceSystem { get; set; }
        public string Barcode { get; set; }
        public DateTime? ExpireDate { get; set; }
        public string RefCode { get; set; }
        public int LowStock { get; set; }
        public string PackageBarcode1 { get; set; }
        public int? PackageQty1 { get; set; }
        public double? PackagePrice1 { get; set; }
        public string PackageBarcode2 { get; set; }
        public int? PackageQty2 { get; set; }
        public double? PackagePrice2 { get; set; }
        public string PackageBarcode3 { get; set; }
        public int? PackageQty3 { get; set; }
        public double? PackagePrice3 { get; set; }
        public double? NormalPrice { get; set; }
        public double? SpecialPrice { get; set; }
        public DateTime? SpecialPriceEndDate { get; set; }
        public string SkuCode { get; set; }
        public int CostofsalesAccount { get; set; }
        public int QposQtyBreak { get; set; }
        public string NameCn { get; set; }
        public bool? IsSpecial { get; set; }
        public bool? HasScale { get; set; }
        public bool IsAddup { get; set; }
        public bool IsCutSp { get; set; }
        public bool IsMain { get; set; }
        public bool IsMandatory { get; set; }
        public double TaxRate { get; set; }
        public string TaxCode { get; set; }
        public int Moq { get; set; }
        public int InnerPack { get; set; }
        public bool IsProduction { get; set; }
        public bool IsSync { get; set; }
        public bool WebItem { get; set; }
        public int Points { get; set; }
        public double LevelRate { get; set; }
        public string NameDes { get; set; }
    }
}
