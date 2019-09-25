using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*
            migrationBuilder.CreateTable(
                name: "branch",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    address1 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    address2 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    address3 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    city = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    country = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    phone = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    fax = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    postal1 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    postal2 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    postal3 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    email = table.Column<string>(unicode: false, maxLength: 255, nullable: false, defaultValueSql: "('')"),
                    branch_header = table.Column<string>(type: "text", nullable: true),
                    branch_footer = table.Column<string>(type: "text", nullable: true),
                    activated = table.Column<bool>(nullable: false, defaultValueSql: "((1))"),
                    branch_pos_reciept_Footer = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    branch_pos_reciept_header = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    number_of_table = table.Column<int>(nullable: false, defaultValueSql: "((16))"),
                    numtable = table.Column<int>(nullable: false),
                    cat_id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_branch", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "card",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    email = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    password = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    type = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    name = table.Column<string>(maxLength: 50, nullable: false),
                    short_name = table.Column<string>(maxLength: 50, nullable: true),
                    trading_name = table.Column<string>(maxLength: 50, nullable: true),
                    date_of_birth = table.Column<DateTime>(type: "date", nullable: true),
                    corp_number = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    directory = table.Column<byte>(nullable: true, defaultValueSql: "((1))"),
                    gst_rate = table.Column<double>(nullable: false, defaultValueSql: "((0.15))"),
                    currency_for_purchase = table.Column<byte>(nullable: false, defaultValueSql: "((1))"),
                    company = table.Column<string>(maxLength: 50, nullable: true),
                    address1 = table.Column<string>(maxLength: 50, nullable: true),
                    address2 = table.Column<string>(maxLength: 50, nullable: true),
                    address3 = table.Column<string>(maxLength: 50, nullable: true),
                    city = table.Column<string>(maxLength: 50, nullable: true),
                    country = table.Column<string>(maxLength: 50, nullable: true, defaultValueSql: "('New Zealand')"),
                    phone = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    fax = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    contact = table.Column<string>(unicode: false, maxLength: 50, nullable: true, defaultValueSql: "('')"),
                    nameB = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    companyB = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    address1B = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    address2B = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    cityB = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    countryB = table.Column<string>(unicode: false, maxLength: 50, nullable: true, defaultValueSql: "('New Zealand')"),
                    postal1 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    postal2 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    postal3 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    register_date = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    shipping_fee = table.Column<decimal>(type: "money", nullable: false, defaultValueSql: "((10))"),
                    accept_mass_email = table.Column<bool>(nullable: false),
                    web = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    cat_access = table.Column<string>(unicode: false, maxLength: 255, nullable: true, defaultValueSql: "('')"),
                    cat_access_group = table.Column<byte>(nullable: false),
                    access_level = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    dealer_level = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    discount = table.Column<double>(nullable: false),
                    trans_total = table.Column<decimal>(type: "money", nullable: false),
                    balance = table.Column<decimal>(type: "money", nullable: false),
                    note = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    last_branch_id = table.Column<int>(nullable: true),
                    last_post_time = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    total_posts = table.Column<int>(nullable: false),
                    pm_email = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    pm_ddi = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    pm_mobile = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    sm_name = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    sm_email = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    sm_ddi = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    sm_mobile = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    ap_name = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    ap_email = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    ap_ddi = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    ap_mobile = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    credit_term = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    credit_limit = table.Column<decimal>(type: "money", nullable: false),
                    approved = table.Column<bool>(nullable: true, defaultValueSql: "((1))"),
                    purchase_nza = table.Column<decimal>(type: "money", nullable: false),
                    purchase_average = table.Column<decimal>(type: "money", nullable: false),
                    m1 = table.Column<decimal>(type: "money", nullable: false),
                    m2 = table.Column<decimal>(type: "money", nullable: false),
                    m3 = table.Column<decimal>(type: "money", nullable: false),
                    m4 = table.Column<decimal>(type: "money", nullable: false),
                    m5 = table.Column<decimal>(type: "money", nullable: false),
                    m6 = table.Column<decimal>(type: "money", nullable: false),
                    m7 = table.Column<decimal>(type: "money", nullable: false),
                    m8 = table.Column<decimal>(type: "money", nullable: false),
                    m9 = table.Column<decimal>(type: "money", nullable: false),
                    m10 = table.Column<decimal>(type: "money", nullable: false),
                    m11 = table.Column<decimal>(type: "money", nullable: false),
                    m12 = table.Column<decimal>(type: "money", nullable: false),
                    working_on = table.Column<byte>(nullable: false, defaultValueSql: "((1))"),
                    buy_online = table.Column<bool>(nullable: false),
                    main_card_id = table.Column<int>(nullable: true),
                    is_branch = table.Column<bool>(nullable: false),
                    stop_order = table.Column<bool>(nullable: false),
                    stop_order_reason = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    sales = table.Column<int>(nullable: true),
                    customer_access_level = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    branch_card_id = table.Column<int>(nullable: true),
                    no_sys_quote = table.Column<bool>(nullable: false),
                    tech_email = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    our_branch = table.Column<byte>(nullable: false, defaultValueSql: "((1))"),
                    personal_id = table.Column<int>(nullable: true),
                    total_online_order_point = table.Column<long>(nullable: true, defaultValueSql: "((0))"),
                    registered = table.Column<bool>(nullable: false, defaultValueSql: "((1))"),
                    barcode = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    points = table.Column<int>(nullable: false),
                    is_addup = table.Column<bool>(nullable: false),
                    mobile = table.Column<string>(maxLength: 50, nullable: true),
                    updated = table.Column<bool>(nullable: false, defaultValueSql: "((1))"),
                    m_discount_rate = table.Column<double>(nullable: true),
                    has_expired = table.Column<bool>(nullable: true),
                    language = table.Column<byte>(nullable: false, defaultValueSql: "((1))"),
                    price_level = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    name_cn = table.Column<string>(maxLength: 150, nullable: true),
                    post_code = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    nationality = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    member_id = table.Column<string>(unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_card", x => x.id);
                });
*/
            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    parent_id = table.Column<int>(nullable: false),
                    active = table.Column<bool>(nullable: false),
                    description = table.Column<string>(maxLength: 50, nullable: false),
                    layer_level = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.id);
                });
/*
            migrationBuilder.CreateTable(
                name: "code_relations",
                columns: table => new
                {
                    id = table.Column<string>(unicode: false, maxLength: 100, nullable: false),
                    code = table.Column<int>(nullable: false),
                    supplier = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    supplier_code = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    supplier_price = table.Column<decimal>(type: "money", nullable: true, defaultValueSql: "((0))"),
                    average_cost = table.Column<decimal>(type: "money", nullable: false),
                    rate = table.Column<double>(nullable: false, defaultValueSql: "((1.1))"),
                    name = table.Column<string>(maxLength: 255, nullable: true),
                    brand = table.Column<string>(maxLength: 50, nullable: true),
                    cat = table.Column<string>(maxLength: 50, nullable: true),
                    s_cat = table.Column<string>(maxLength: 50, nullable: true),
                    ss_cat = table.Column<string>(maxLength: 50, nullable: true),
                    hot = table.Column<bool>(nullable: false, defaultValueSql: "((1))"),
                    skip = table.Column<bool>(nullable: false),
                    clearance = table.Column<bool>(nullable: false),
                    inventory_account = table.Column<string>(maxLength: 50, nullable: true),
                    cost_account = table.Column<int>(nullable: true),
                    income_account = table.Column<int>(nullable: true),
                    foreign_supplier_price = table.Column<decimal>(type: "money", nullable: true),
                    currency = table.Column<byte>(nullable: false, defaultValueSql: "((1))"),
                    exchange_rate = table.Column<double>(nullable: true),
                    nzd_freight = table.Column<decimal>(type: "money", nullable: false),
                    level_rate1 = table.Column<double>(nullable: false, defaultValueSql: "((2))"),
                    level_rate2 = table.Column<double>(nullable: false, defaultValueSql: "((1.5))"),
                    level_rate3 = table.Column<double>(nullable: false, defaultValueSql: "((1.2))"),
                    level_rate4 = table.Column<double>(nullable: false, defaultValueSql: "((1.1))"),
                    level_rate5 = table.Column<double>(nullable: false, defaultValueSql: "((1))"),
                    level_rate6 = table.Column<double>(nullable: false, defaultValueSql: "((0.9))"),
                    level_rate7 = table.Column<double>(nullable: true, defaultValueSql: "((2))"),
                    level_rate8 = table.Column<double>(nullable: true, defaultValueSql: "((2))"),
                    level_rate9 = table.Column<double>(nullable: true, defaultValueSql: "((2))"),
                    qty_break1 = table.Column<int>(nullable: false, defaultValueSql: "((5))"),
                    qty_break2 = table.Column<int>(nullable: true, defaultValueSql: "((10))"),
                    qty_break3 = table.Column<int>(nullable: true, defaultValueSql: "((20))"),
                    qty_break4 = table.Column<int>(nullable: true, defaultValueSql: "((50))"),
                    qty_break5 = table.Column<int>(nullable: true, defaultValueSql: "((0))"),
                    qty_break6 = table.Column<int>(nullable: true, defaultValueSql: "((0))"),
                    qty_break7 = table.Column<int>(nullable: true, defaultValueSql: "((0))"),
                    qty_break8 = table.Column<int>(nullable: true, defaultValueSql: "((0))"),
                    qty_break9 = table.Column<int>(nullable: true),
                    qty_break_discount1 = table.Column<double>(nullable: false, defaultValueSql: "((1))"),
                    qty_break_discount2 = table.Column<double>(nullable: true),
                    qty_break_discount3 = table.Column<double>(nullable: true),
                    qty_break_discount4 = table.Column<double>(nullable: true),
                    qty_break_discount5 = table.Column<double>(nullable: true),
                    qty_break_discount6 = table.Column<double>(nullable: true),
                    qty_break_discount7 = table.Column<double>(nullable: true),
                    qty_break_discount8 = table.Column<double>(nullable: true),
                    qty_break_discount9 = table.Column<double>(nullable: true),
                    qty_break_price1 = table.Column<decimal>(type: "money", nullable: true),
                    qty_break_price2 = table.Column<decimal>(type: "money", nullable: true),
                    qty_break_price3 = table.Column<decimal>(type: "money", nullable: true),
                    qty_break_price4 = table.Column<decimal>(type: "money", nullable: true),
                    qty_break_price5 = table.Column<decimal>(type: "money", nullable: true),
                    qty_break_price6 = table.Column<decimal>(type: "money", nullable: true),
                    qty_break_price7 = table.Column<decimal>(type: "money", nullable: true),
                    qty_break_price8 = table.Column<decimal>(type: "money", nullable: true),
                    qty_break_price9 = table.Column<decimal>(type: "money", nullable: true),
                    qty_break_price10 = table.Column<decimal>(type: "money", nullable: true),
                    manual_cost_frd = table.Column<decimal>(type: "money", nullable: false),
                    manual_exchange_rate = table.Column<double>(nullable: false, defaultValueSql: "((1))"),
                    manual_cost_nzd = table.Column<decimal>(type: "money", nullable: false),
                    allocated_stock = table.Column<int>(nullable: false),
                    is_service = table.Column<bool>(nullable: false),
                    rrp = table.Column<decimal>(type: "money", nullable: false),
                    promotion = table.Column<byte>(nullable: true, defaultValueSql: "((0))"),
                    coming_soon = table.Column<byte>(nullable: true, defaultValueSql: "((0))"),
                    weight = table.Column<double>(nullable: true, defaultValueSql: "((10))"),
                    inactive = table.Column<byte>(nullable: true, defaultValueSql: "((0))"),
                    stock_location = table.Column<string>(maxLength: 50, nullable: true),
                    popular = table.Column<bool>(nullable: false, defaultValueSql: "((1))"),
                    real_stock = table.Column<bool>(nullable: false),
                    disappeared = table.Column<int>(nullable: false),
                    price1 = table.Column<decimal>(type: "money", nullable: false),
                    price2 = table.Column<decimal>(type: "money", nullable: false),
                    price3 = table.Column<decimal>(type: "money", nullable: false),
                    price4 = table.Column<decimal>(type: "money", nullable: false),
                    price5 = table.Column<decimal>(type: "money", nullable: false),
                    price6 = table.Column<decimal>(type: "money", nullable: false),
                    price7 = table.Column<decimal>(type: "money", nullable: false),
                    price8 = table.Column<decimal>(type: "money", nullable: false),
                    price9 = table.Column<decimal>(type: "money", nullable: false),
                    level_price0 = table.Column<decimal>(type: "money", nullable: false),
                    level_price1 = table.Column<decimal>(type: "money", nullable: false),
                    level_price2 = table.Column<decimal>(type: "money", nullable: false),
                    level_price3 = table.Column<decimal>(type: "money", nullable: false),
                    level_price4 = table.Column<decimal>(type: "money", nullable: false),
                    level_price5 = table.Column<decimal>(type: "money", nullable: false),
                    level_price6 = table.Column<decimal>(type: "money", nullable: false),
                    base_price = table.Column<decimal>(type: "money", nullable: false),
                    price_system = table.Column<decimal>(type: "money", nullable: false),
                    barcode = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    expire_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    ref_code = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    low_stock = table.Column<int>(nullable: false),
                    package_barcode1 = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    package_qty1 = table.Column<int>(nullable: true),
                    package_price1 = table.Column<double>(nullable: true),
                    package_barcode2 = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    package_qty2 = table.Column<int>(nullable: true),
                    package_price2 = table.Column<double>(nullable: true),
                    package_barcode3 = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    package_qty3 = table.Column<int>(nullable: true),
                    package_price3 = table.Column<double>(nullable: true),
                    normal_price = table.Column<double>(nullable: true),
                    special_price = table.Column<double>(nullable: true),
                    special_price_end_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    sku_code = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    costofsales_account = table.Column<int>(nullable: false, defaultValueSql: "((5111))"),
                    qpos_qty_break = table.Column<int>(nullable: false),
                    name_cn = table.Column<string>(maxLength: 500, nullable: true),
                    is_special = table.Column<bool>(nullable: true, defaultValueSql: "((0))"),
                    has_scale = table.Column<bool>(nullable: true, defaultValueSql: "((0))"),
                    is_addup = table.Column<bool>(nullable: false),
                    is_cut_sp = table.Column<bool>(nullable: false),
                    is_main = table.Column<bool>(nullable: false),
                    is_mandatory = table.Column<bool>(nullable: false),
                    tax_rate = table.Column<double>(nullable: false, defaultValueSql: "((0.15))"),
                    tax_code = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    moq = table.Column<int>(nullable: false),
                    inner_pack = table.Column<int>(nullable: false),
                    is_production = table.Column<bool>(nullable: false),
                    is_sync = table.Column<bool>(nullable: false),
                    web_item = table.Column<bool>(nullable: false),
                    points = table.Column<int>(nullable: false),
                    level_rate = table.Column<double>(nullable: false, defaultValueSql: "((1))"),
                    name_des = table.Column<string>(maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_code_relations", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "enum",
                columns: table => new
                {
                    @class = table.Column<string>(name: "class", unicode: false, maxLength: 50, nullable: false),
                    id = table.Column<int>(nullable: false),
                    name = table.Column<string>(maxLength: 50, nullable: false),
                    class_type = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    short_name = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    updated = table.Column<bool>(nullable: false, defaultValueSql: "((1))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_enum", x => new { x.@class, x.id });
                });

            migrationBuilder.CreateTable(
                name: "invoice",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    invoice_number = table.Column<int>(nullable: false),
                    branch = table.Column<int>(nullable: true, defaultValueSql: "((1))"),
                    type = table.Column<byte>(nullable: true, defaultValueSql: "((3))"),
                    sales_type = table.Column<byte>(nullable: false, defaultValueSql: "((1))"),
                    card_id = table.Column<int>(nullable: false),
                    special_shipto = table.Column<bool>(nullable: false),
                    shipto = table.Column<string>(maxLength: 1024, nullable: true),
                    price = table.Column<decimal>(type: "money", nullable: true),
                    tax = table.Column<decimal>(type: "money", nullable: true),
                    freight = table.Column<decimal>(type: "money", nullable: true, defaultValueSql: "((0))"),
                    total = table.Column<decimal>(type: "money", nullable: true),
                    commit_date = table.Column<DateTime>(type: "datetime", nullable: false),
                    payment_type = table.Column<byte>(nullable: true, defaultValueSql: "((2))"),
                    paid = table.Column<bool>(nullable: false),
                    refunded = table.Column<bool>(nullable: false),
                    amount_paid = table.Column<decimal>(type: "money", nullable: true, defaultValueSql: "((0))"),
                    trans_failed_reason = table.Column<string>(unicode: false, maxLength: 1024, nullable: true),
                    system = table.Column<bool>(nullable: false),
                    sales = table.Column<string>(maxLength: 250, nullable: true),
                    debug_info = table.Column<string>(unicode: false, maxLength: 2048, nullable: true),
                    no_individual_price = table.Column<bool>(nullable: false),
                    gst_inclusive = table.Column<bool>(nullable: false),
                    status = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    cust_ponumber = table.Column<string>(maxLength: 50, nullable: true),
                    sales_note = table.Column<string>(type: "ntext", nullable: true),
                    shipping_method = table.Column<byte>(nullable: false, defaultValueSql: "((1))"),
                    pick_up_time = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    name = table.Column<string>(maxLength: 250, nullable: true),
                    company = table.Column<string>(maxLength: 255, nullable: true),
                    trading_name = table.Column<string>(maxLength: 255, nullable: true),
                    email = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    address1 = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    address2 = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    address3 = table.Column<string>(unicode: false, maxLength: 255, nullable: true),
                    postal1 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    postal2 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    postal3 = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    phone = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    fax = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    agent = table.Column<int>(nullable: false),
                    record_date = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    customer_gst = table.Column<double>(nullable: false, defaultValueSql: "((0.125))"),
                    uploaded = table.Column<int>(nullable: false),
                    barcode = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    is_redeem = table.Column<bool>(nullable: false),
                    points = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invoice", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "order_item",
                columns: table => new
                {
                    kid = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    id = table.Column<int>(nullable: false),
                    code = table.Column<int>(nullable: false),
                    quantity = table.Column<double>(nullable: false),
                    item_name = table.Column<string>(maxLength: 255, nullable: false),
                    supplier = table.Column<string>(unicode: false, maxLength: 200, nullable: true),
                    supplier_code = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    supplier_price = table.Column<decimal>(type: "money", nullable: false),
                    commit_price = table.Column<decimal>(type: "money", nullable: false),
                    eta = table.Column<string>(maxLength: 50, nullable: true),
                    note = table.Column<string>(maxLength: 255, nullable: true),
                    system = table.Column<bool>(nullable: false),
                    sys_special = table.Column<bool>(nullable: false),
                    part = table.Column<int>(nullable: false, defaultValueSql: "((-1))"),
                    kit = table.Column<bool>(nullable: false),
                    krid = table.Column<int>(nullable: true),
                    discount_percent = table.Column<double>(nullable: false),
                    order_total = table.Column<decimal>(type: "money", nullable: true),
                    station_id = table.Column<string>(maxLength: 50, nullable: true),
                    cat = table.Column<string>(maxLength: 50, nullable: true),
                    s_cat = table.Column<string>(maxLength: 50, nullable: true),
                    ss_cat = table.Column<string>(maxLength: 50, nullable: true),
                    item_name_cn = table.Column<string>(maxLength: 500, nullable: true),
                    tax_rate = table.Column<double>(nullable: true, defaultValueSql: "((0.15))"),
                    tax_code = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    points = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_order_item", x => x.kid);
                });

            migrationBuilder.CreateTable(
                name: "orders",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    branch = table.Column<int>(nullable: false, defaultValueSql: "((1))"),
                    number = table.Column<int>(nullable: false),
                    part = table.Column<int>(nullable: false),
                    card_id = table.Column<int>(nullable: false),
                    po_number = table.Column<string>(maxLength: 250, nullable: true),
                    status = table.Column<byte>(nullable: true, defaultValueSql: "((1))"),
                    invoice_number = table.Column<int>(nullable: true),
                    record_date = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    contact = table.Column<string>(maxLength: 250, nullable: true),
                    special_shipto = table.Column<bool>(nullable: false),
                    shipto = table.Column<string>(maxLength: 1024, nullable: true),
                    date_shipped = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    shipby = table.Column<int>(nullable: true),
                    freight = table.Column<decimal>(type: "money", nullable: false),
                    ticket = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    sales = table.Column<int>(nullable: true),
                    sales_manager = table.Column<int>(nullable: true),
                    sales_note = table.Column<string>(type: "ntext", nullable: true),
                    locked_by = table.Column<int>(nullable: true),
                    time_locked = table.Column<DateTime>(type: "datetime", nullable: true),
                    shipping_method = table.Column<byte>(nullable: false, defaultValueSql: "((1))"),
                    pick_up_time = table.Column<string>(maxLength: 250, nullable: true),
                    payment_type = table.Column<byte>(nullable: false, defaultValueSql: "((3))"),
                    paid = table.Column<bool>(nullable: false),
                    trans_failed_reason = table.Column<string>(unicode: false, maxLength: 1024, nullable: true),
                    debug_info = table.Column<string>(unicode: false, maxLength: 1024, nullable: true),
                    system = table.Column<bool>(nullable: false),
                    no_individual_price = table.Column<bool>(nullable: false),
                    gst_inclusive = table.Column<bool>(nullable: false),
                    type = table.Column<int>(nullable: false, defaultValueSql: "((2))"),
                    quote_total = table.Column<decimal>(type: "money", nullable: false),
                    purchase_id = table.Column<int>(nullable: true),
                    dealer_draft = table.Column<bool>(nullable: false),
                    ship_as_parts = table.Column<bool>(nullable: false),
                    dealer_customer_name = table.Column<string>(maxLength: 250, nullable: true),
                    dealer_total = table.Column<decimal>(type: "money", nullable: false),
                    @unchecked = table.Column<bool>(name: "unchecked", nullable: false, defaultValueSql: "((1))"),
                    status_orderonly = table.Column<byte>(nullable: false, defaultValueSql: "((1))"),
                    credit_order_id = table.Column<int>(nullable: true),
                    agent = table.Column<int>(nullable: false),
                    customer_gst = table.Column<double>(nullable: false, defaultValueSql: "((0.125))"),
                    station_id = table.Column<string>(maxLength: 50, nullable: true),
                    order_deleted = table.Column<bool>(nullable: true, defaultValueSql: "((0))"),
                    total_discount = table.Column<decimal>(type: "money", nullable: true),
                    total_special = table.Column<decimal>(type: "money", nullable: true),
                    table_name = table.Column<string>(maxLength: 50, nullable: true),
                    delivery_number = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    is_redeem = table.Column<bool>(nullable: false),
                    expecting_date = table.Column<string>(maxLength: 250, nullable: true),
                    points = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orders", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sales",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    invoice_number = table.Column<int>(nullable: false),
                    code = table.Column<int>(nullable: false),
                    quantity = table.Column<double>(nullable: false),
                    name = table.Column<string>(maxLength: 255, nullable: true),
                    supplier = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    supplier_code = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    serial_number = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    commit_price = table.Column<decimal>(type: "money", nullable: false),
                    supplier_price = table.Column<decimal>(type: "money", nullable: false),
                    status = table.Column<byte>(nullable: true),
                    shipby = table.Column<byte>(nullable: true),
                    ticket = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    note = table.Column<string>(maxLength: 1024, nullable: true),
                    ship_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    processed_by = table.Column<int>(nullable: true),
                    system = table.Column<bool>(nullable: false),
                    sys_special = table.Column<bool>(nullable: false),
                    part = table.Column<int>(nullable: true, defaultValueSql: "((-1))"),
                    p_status = table.Column<byte>(nullable: true),
                    owner = table.Column<int>(nullable: true),
                    used = table.Column<bool>(nullable: false),
                    stock_at_sales = table.Column<int>(nullable: true),
                    kit = table.Column<bool>(nullable: false),
                    krid = table.Column<int>(nullable: true),
                    normal_price = table.Column<decimal>(type: "money", nullable: false),
                    income_account = table.Column<int>(nullable: true, defaultValueSql: "((4111))"),
                    costofsales_account = table.Column<int>(nullable: true, defaultValueSql: "((5111))"),
                    inventory_account = table.Column<int>(nullable: true, defaultValueSql: "((1121))"),
                    discount_percent = table.Column<double>(nullable: false),
                    sales_total = table.Column<decimal>(type: "money", nullable: true),
                    station_id = table.Column<string>(maxLength: 50, nullable: true),
                    cat = table.Column<string>(maxLength: 50, nullable: true),
                    s_cat = table.Column<string>(maxLength: 50, nullable: true),
                    ss_cat = table.Column<string>(maxLength: 50, nullable: true),
                    name_cn = table.Column<string>(maxLength: 500, nullable: true),
                    tax_rate = table.Column<double>(nullable: true, defaultValueSql: "((0.15))"),
                    tax_code = table.Column<string>(unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sales", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tran_detail",
                columns: table => new
                {
                    kid = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    id = table.Column<int>(nullable: false),
                    invoice_number = table.Column<string>(unicode: false, maxLength: 4096, nullable: true),
                    source_balance = table.Column<decimal>(type: "money", nullable: true),
                    dest_balance = table.Column<decimal>(type: "money", nullable: true),
                    trans_date = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    staff_id = table.Column<int>(nullable: true),
                    card_id = table.Column<int>(nullable: true),
                    note = table.Column<string>(maxLength: 1024, nullable: true),
                    payment_method = table.Column<int>(nullable: true),
                    payment_ref = table.Column<string>(maxLength: 150, nullable: true),
                    finance = table.Column<decimal>(type: "money", nullable: false),
                    currency_loss = table.Column<decimal>(type: "money", nullable: false),
                    credit = table.Column<decimal>(type: "money", nullable: false),
                    paid_by = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    bank = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    branch = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    credit_id = table.Column<int>(nullable: true),
                    table_id = table.Column<int>(nullable: true),
                    cleaned = table.Column<bool>(nullable: false),
                    till_id = table.Column<bool>(nullable: true, defaultValueSql: "((1))"),
                    bill_payment_no = table.Column<string>(unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tran_detail", x => x.kid);
                });

            migrationBuilder.CreateTable(
                name: "trans",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    source = table.Column<int>(nullable: true),
                    dest = table.Column<int>(nullable: true),
                    amount = table.Column<decimal>(type: "money", nullable: false),
                    dest_amount = table.Column<decimal>(type: "money", nullable: true),
                    banked = table.Column<bool>(nullable: false),
                    trans_bank_id = table.Column<int>(nullable: true),
                    trans_date = table.Column<int>(nullable: true),
                    branch = table.Column<byte>(nullable: false, defaultValueSql: "((1))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trans", x => x.id);
                });
*/
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
/*
            migrationBuilder.CreateTable(
                name: "tran_invoice",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    tran_id = table.Column<int>(nullable: false),
                    payment_method = table.Column<int>(nullable: true),
                    amount_applied = table.Column<decimal>(type: "money", nullable: false),
                    purchase = table.Column<bool>(nullable: false),
                    invoice_number = table.Column<int>(nullable: false),
                    invoiceId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tran_invoice", x => x.id);
                    table.ForeignKey(
                        name: "FK_tran_invoice_invoice_invoiceId",
                        column: x => x.invoiceId,
                        principalTable: "invoice",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
*/
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
                    Unitid = table.Column<int>(nullable: false),
                    Categoryid = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Item", x => x.id);
                    table.ForeignKey(
                        name: "FK_Item_Category_Categoryid",
                        column: x => x.Categoryid,
                        principalTable: "Category",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Item_Unit_Unitid",
                        column: x => x.Unitid,
                        principalTable: "Unit",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.CreateIndex(
                name: "IX_Barcode_itemId",
                table: "Barcode",
                column: "itemId");
/*
            migrationBuilder.CreateIndex(
                name: "IDX_branch_id",
                table: "branch",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "IDX_code_relations_cat",
                table: "code_relations",
                column: "cat");

            migrationBuilder.CreateIndex(
                name: "IDX_code_relations_clearance",
                table: "code_relations",
                column: "clearance");

            migrationBuilder.CreateIndex(
                name: "IDX_code_relations_code",
                table: "code_relations",
                column: "code");

            migrationBuilder.CreateIndex(
                name: "IDX_code_relations_id",
                table: "code_relations",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "IDX_code_relations_scat",
                table: "code_relations",
                column: "s_cat");

            migrationBuilder.CreateIndex(
                name: "IDX_code_relations_sscat",
                table: "code_relations",
                column: "ss_cat");

            migrationBuilder.CreateIndex(
                name: "IDX_code_relations_spl_code",
                table: "code_relations",
                column: "supplier_code");

            migrationBuilder.CreateIndex(
                name: "IDX_enum_class",
                table: "enum",
                column: "class");

            migrationBuilder.CreateIndex(
                name: "IDX_enum_class_id",
                table: "enum",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "IDX_enum_name",
                table: "enum",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "IDX_invoice_branch",
                table: "invoice",
                column: "branch");

            migrationBuilder.CreateIndex(
                name: "IDX_invoice_card_id",
                table: "invoice",
                column: "card_id");

            migrationBuilder.CreateIndex(
                name: "IX_invoice_id",
                table: "invoice",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IDX_invoice_number",
                table: "invoice",
                column: "invoice_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IDX_invoice_type",
                table: "invoice",
                column: "type");
*/
            migrationBuilder.CreateIndex(
                name: "IX_Item_Categoryid",
                table: "Item",
                column: "Categoryid");

            migrationBuilder.CreateIndex(
                name: "IX_Item_Unitid",
                table: "Item",
                column: "Unitid");
/*
            migrationBuilder.CreateIndex(
                name: "IDX_order_item_code",
                table: "order_item",
                column: "code");

            migrationBuilder.CreateIndex(
                name: "IDX_order_item_id",
                table: "order_item",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "IDX_order_item_krid",
                table: "order_item",
                column: "kid");

            migrationBuilder.CreateIndex(
                name: "IDX_order_item_kit",
                table: "order_item",
                column: "kit");

            migrationBuilder.CreateIndex(
                name: "IDX_order_item_supplier_code",
                table: "order_item",
                column: "supplier_code");

            migrationBuilder.CreateIndex(
                name: "IDX_orders_card_id",
                table: "orders",
                column: "card_id");

            migrationBuilder.CreateIndex(
                name: "IDX_orders_id",
                table: "orders",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IDX_orders_invoice_number",
                table: "orders",
                column: "invoice_number");

            migrationBuilder.CreateIndex(
                name: "IDX_orders_sales",
                table: "orders",
                column: "sales");

            migrationBuilder.CreateIndex(
                name: "IDX_sales_code",
                table: "sales",
                column: "code");

            migrationBuilder.CreateIndex(
                name: "IDX_sales_invoice_number",
                table: "sales",
                column: "invoice_number");

            migrationBuilder.CreateIndex(
                name: "IDX_sales_kit",
                table: "sales",
                column: "kit");

            migrationBuilder.CreateIndex(
                name: "IDX_sales_krid",
                table: "sales",
                column: "krid");

            migrationBuilder.CreateIndex(
                name: "IDX_sales_part",
                table: "sales",
                column: "part");

            migrationBuilder.CreateIndex(
                name: "IDX_sales_status",
                table: "sales",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IDX_sales_system",
                table: "sales",
                column: "system");

            migrationBuilder.CreateIndex(
                name: "IDX_tran_detail_card_id",
                table: "tran_detail",
                column: "card_id");

            migrationBuilder.CreateIndex(
                name: "IDX_tran_detail_id",
                table: "tran_detail",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "IX_tran_detail_staff_id",
                table: "tran_detail",
                column: "staff_id");

            migrationBuilder.CreateIndex(
                name: "IDX_tran_invoice_purchase",
                table: "tran_invoice",
                column: "purchase");

            migrationBuilder.CreateIndex(
                name: "IDX_tran_invoice_tranid",
                table: "tran_invoice",
                column: "tran_id");

            migrationBuilder.CreateIndex(
                name: "IX_tran_invoice_invoiceId",
                table: "tran_invoice",
                column: "invoiceId");

            migrationBuilder.CreateIndex(
                name: "IDX_trans_banked",
                table: "trans",
                column: "banked");

            migrationBuilder.CreateIndex(
                name: "IDX_trans_branch",
                table: "trans",
                column: "branch");
                */
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Barcode");

            migrationBuilder.DropTable(
                name: "branch");

            migrationBuilder.DropTable(
                name: "card");

            migrationBuilder.DropTable(
                name: "code_relations");

            migrationBuilder.DropTable(
                name: "enum");

            migrationBuilder.DropTable(
                name: "order_item");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropTable(
                name: "sales");

            migrationBuilder.DropTable(
                name: "tran_detail");

            migrationBuilder.DropTable(
                name: "tran_invoice");

            migrationBuilder.DropTable(
                name: "trans");

            migrationBuilder.DropTable(
                name: "Item");

            migrationBuilder.DropTable(
                name: "invoice");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Unit");
        }
    }
}
