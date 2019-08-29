using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class additemrelated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    parent_id = table.Column<int>(nullable: true),
                    active = table.Column<bool>(nullable: false),
                    desciption = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Unit",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    unit = table.Column<string>(nullable: true),
                    quantity = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Unit", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Item",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    code = table.Column<int>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    name_cn = table.Column<string>(nullable: true),
                    price = table.Column<decimal>(nullable: false),
                    cost = table.Column<decimal>(nullable: false),
                    Categoryid = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Item", x => x.id);
                    table.ForeignKey(
                        name: "FK_Item_Category_Categoryid",
                        column: x => x.Categoryid,
                        principalTable: "Category",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Barcode",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    code = table.Column<int>(nullable: false),
                    barcode = table.Column<string>(nullable: true),
                    itemId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Barcode", x => x.id);
                    table.ForeignKey(
                        name: "FK_Barcode_Item_itemId",
                        column: x => x.itemId,
                        principalTable: "Item",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemToCategory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    itemId = table.Column<int>(nullable: false),
                    CategoryId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemToCategory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemToCategory_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemToCategory_Item_itemId",
                        column: x => x.itemId,
                        principalTable: "Item",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Barcode_itemId",
                table: "Barcode",
                column: "itemId");

            migrationBuilder.CreateIndex(
                name: "IX_Item_Categoryid",
                table: "Item",
                column: "Categoryid");

            migrationBuilder.CreateIndex(
                name: "IX_ItemToCategory_CategoryId",
                table: "ItemToCategory",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemToCategory_itemId",
                table: "ItemToCategory",
                column: "itemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Barcode");

            migrationBuilder.DropTable(
                name: "ItemToCategory");

            migrationBuilder.DropTable(
                name: "Unit");

            migrationBuilder.DropTable(
                name: "Item");

            migrationBuilder.DropTable(
                name: "Category");
        }
    }
}
