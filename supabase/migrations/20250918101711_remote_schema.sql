drop extension if exists "pg_net";

create sequence "public"."order_number_seq";


  create table "public"."cart_items" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "menu_item_id" uuid,
    "restaurant_id" uuid,
    "quantity" integer not null default 1,
    "price" numeric(10,2) not null,
    "total_price" numeric(10,2) not null,
    "note" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."cart_items" enable row level security;


  create table "public"."categories" (
    "id" uuid not null default gen_random_uuid(),
    "category_name" character varying(60) not null,
    "category_description" character varying(200) not null,
    "image_url" character varying(550) default NULL::character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."discounts" (
    "id" uuid not null default gen_random_uuid(),
    "title" character varying(100) not null,
    "description" text,
    "image_url" text,
    "discount_percent" integer not null,
    "valid_until" timestamp without time zone,
    "is_active" boolean default true,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
      );



  create table "public"."menu_items" (
    "id" uuid not null default gen_random_uuid(),
    "restaurant_id" uuid,
    "name" character varying(255) not null,
    "description" text,
    "price" numeric(10,2) not null,
    "image_url" character varying(550) default NULL::character varying,
    "is_vegetarian" boolean default false,
    "is_popular" boolean default false,
    "is_available" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."order_items" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid,
    "menu_item_id" uuid,
    "quantity" integer not null,
    "price" numeric(10,2) not null,
    "total_price" numeric(10,2) not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."order_items" enable row level security;


  create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "restaurant_id" uuid,
    "address_id" uuid,
    "total_amount" numeric(10,2) not null,
    "delivery_fee" numeric(10,2) default 5,
    "payment_method" character varying(100) not null,
    "status" character varying(255) not null default 'Pending'::character varying,
    "order_number" character varying(50) not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."orders" enable row level security;


  create table "public"."restaurant_ratings" (
    "id" uuid not null default gen_random_uuid(),
    "restaurant_id" uuid,
    "user_id" uuid,
    "rating" integer not null,
    "review" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."restaurant_ratings" enable row level security;


  create table "public"."restaurants" (
    "id" uuid not null default gen_random_uuid(),
    "restaurant_name" character varying(255) not null,
    "address" character varying(255) not null,
    "phone" character varying(255) not null,
    "email" character varying(255) not null,
    "category_id" uuid,
    "image_url" character varying(550) default NULL::character varying,
    "rating" numeric(3,2) default 0,
    "total_reviews" integer default 0,
    "delivery_fee" numeric(10,2) default 5,
    "minimum_order" numeric(10,2) default 0,
    "delivery_time" character varying(50) default '30-45 mins'::character varying,
    "is_open" boolean default true,
    "is_featured" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."user_addresses" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "address" text not null,
    "country" character varying(100) default 'Pakistan'::character varying,
    "city" character varying(100),
    "is_default" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."user_addresses" enable row level security;


  create table "public"."user_favorites" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "restaurant_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."user_favorites" enable row level security;

CREATE UNIQUE INDEX cart_items_pkey ON public.cart_items USING btree (id);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX discounts_pkey ON public.discounts USING btree (id);

CREATE INDEX idx_cart_items_user ON public.cart_items USING btree (user_id);

CREATE INDEX idx_menu_items_restaurant ON public.menu_items USING btree (restaurant_id);

CREATE INDEX idx_orders_status ON public.orders USING btree (status);

CREATE INDEX idx_orders_user ON public.orders USING btree (user_id);

CREATE INDEX idx_restaurants_category ON public.restaurants USING btree (category_id);

CREATE INDEX idx_restaurants_featured ON public.restaurants USING btree (is_featured);

CREATE UNIQUE INDEX menu_items_pkey ON public.menu_items USING btree (id);

CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id);

CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX restaurant_ratings_pkey ON public.restaurant_ratings USING btree (id);

CREATE UNIQUE INDEX restaurants_email_key ON public.restaurants USING btree (email);

CREATE UNIQUE INDEX restaurants_pkey ON public.restaurants USING btree (id);

CREATE UNIQUE INDEX user_addresses_pkey ON public.user_addresses USING btree (id);

CREATE UNIQUE INDEX user_favorites_pkey ON public.user_favorites USING btree (id);

CREATE UNIQUE INDEX user_favorites_user_id_restaurant_id_key ON public.user_favorites USING btree (user_id, restaurant_id);

alter table "public"."cart_items" add constraint "cart_items_pkey" PRIMARY KEY using index "cart_items_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."discounts" add constraint "discounts_pkey" PRIMARY KEY using index "discounts_pkey";

alter table "public"."menu_items" add constraint "menu_items_pkey" PRIMARY KEY using index "menu_items_pkey";

alter table "public"."order_items" add constraint "order_items_pkey" PRIMARY KEY using index "order_items_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."restaurant_ratings" add constraint "restaurant_ratings_pkey" PRIMARY KEY using index "restaurant_ratings_pkey";

alter table "public"."restaurants" add constraint "restaurants_pkey" PRIMARY KEY using index "restaurants_pkey";

alter table "public"."user_addresses" add constraint "user_addresses_pkey" PRIMARY KEY using index "user_addresses_pkey";

alter table "public"."user_favorites" add constraint "user_favorites_pkey" PRIMARY KEY using index "user_favorites_pkey";

alter table "public"."cart_items" add constraint "cart_items_menu_item_id_fkey" FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_menu_item_id_fkey";

alter table "public"."cart_items" add constraint "cart_items_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_restaurant_id_fkey";

alter table "public"."cart_items" add constraint "cart_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_user_id_fkey";

alter table "public"."discounts" add constraint "discounts_discount_percent_check" CHECK (((discount_percent > 0) AND (discount_percent <= 100))) not valid;

alter table "public"."discounts" validate constraint "discounts_discount_percent_check";

alter table "public"."menu_items" add constraint "menu_items_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE not valid;

alter table "public"."menu_items" validate constraint "menu_items_restaurant_id_fkey";

alter table "public"."order_items" add constraint "order_items_menu_item_id_fkey" FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) not valid;

alter table "public"."order_items" validate constraint "order_items_menu_item_id_fkey";

alter table "public"."order_items" add constraint "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_order_id_fkey";

alter table "public"."orders" add constraint "orders_address_id_fkey" FOREIGN KEY (address_id) REFERENCES user_addresses(id) not valid;

alter table "public"."orders" validate constraint "orders_address_id_fkey";

alter table "public"."orders" add constraint "orders_order_number_key" UNIQUE using index "orders_order_number_key";

alter table "public"."orders" add constraint "orders_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) not valid;

alter table "public"."orders" validate constraint "orders_restaurant_id_fkey";

alter table "public"."orders" add constraint "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."orders" validate constraint "orders_user_id_fkey";

alter table "public"."restaurant_ratings" add constraint "restaurant_ratings_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."restaurant_ratings" validate constraint "restaurant_ratings_rating_check";

alter table "public"."restaurant_ratings" add constraint "restaurant_ratings_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE not valid;

alter table "public"."restaurant_ratings" validate constraint "restaurant_ratings_restaurant_id_fkey";

alter table "public"."restaurant_ratings" add constraint "restaurant_ratings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."restaurant_ratings" validate constraint "restaurant_ratings_user_id_fkey";

alter table "public"."restaurants" add constraint "restaurants_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."restaurants" validate constraint "restaurants_category_id_fkey";

alter table "public"."restaurants" add constraint "restaurants_email_key" UNIQUE using index "restaurants_email_key";

alter table "public"."user_addresses" add constraint "user_addresses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_addresses" validate constraint "user_addresses_user_id_fkey";

alter table "public"."user_favorites" add constraint "user_favorites_restaurant_id_fkey" FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE not valid;

alter table "public"."user_favorites" validate constraint "user_favorites_restaurant_id_fkey";

alter table "public"."user_favorites" add constraint "user_favorites_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_favorites" validate constraint "user_favorites_user_id_fkey";

alter table "public"."user_favorites" add constraint "user_favorites_user_id_restaurant_id_key" UNIQUE using index "user_favorites_user_id_restaurant_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_order_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.order_number = 'NB' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(nextval('order_number_seq')::text, 4, '0');
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_restaurant_rating()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE restaurants 
    SET 
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 2) 
            FROM restaurant_ratings 
            WHERE restaurant_id = NEW.restaurant_id
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM restaurant_ratings 
            WHERE restaurant_id = NEW.restaurant_id
        ),
        updated_at = NOW()
    WHERE id = NEW.restaurant_id;
    RETURN NEW;
END;
$function$
;


  create policy "Users can manage own cart"
  on "public"."cart_items"
  as permissive
  for all
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own order items"
  on "public"."order_items"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM orders
  WHERE ((orders.id = order_items.order_id) AND (orders.user_id = auth.uid())))));



  create policy "Users can create own orders"
  on "public"."orders"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view own orders"
  on "public"."orders"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can manage own ratings"
  on "public"."restaurant_ratings"
  as permissive
  for all
  to public
using ((auth.uid() = user_id));



  create policy "Users can view all ratings"
  on "public"."restaurant_ratings"
  as permissive
  for select
  to public
using (true);



  create policy "Users can manage own addresses"
  on "public"."user_addresses"
  as permissive
  for all
  to public
using ((auth.uid() = user_id));



  create policy "Users can manage own favorites"
  on "public"."user_favorites"
  as permissive
  for all
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER trigger_generate_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

CREATE TRIGGER trigger_update_restaurant_rating AFTER INSERT OR UPDATE ON public.restaurant_ratings FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();


