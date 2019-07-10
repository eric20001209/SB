using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class invoiceId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropForeignKey(
            //    name: "FK_tran_invoice_invoice_invoiceId",
            //    table: "tran_invoice");

            migrationBuilder.AddColumn<int>(
                name: "invoiceId",
                table: "tran_invoice",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_tran_invoice_invoice_invoiceId",
                table: "tran_invoice",
                column: "invoiceId",
                principalTable: "invoice",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tran_invoice_invoice_invoiceId",
                table: "tran_invoice");

            migrationBuilder.AlterColumn<int>(
                name: "invoiceId",
                table: "tran_invoice",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_tran_invoice_invoice_invoiceId",
                table: "tran_invoice",
                column: "invoiceId",
                principalTable: "invoice",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
