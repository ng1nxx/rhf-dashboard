"use client";

import { Star } from "lucide-react";

import { AdminRow, Cell, PublishBadge } from "@/components/admin/admin-page";
import { RecordList } from "@/components/admin/record-list";
import { RowActions } from "@/components/admin/row-actions";
import {
  TestimonialForm,
  type TestimonialRecord,
} from "@/components/admin/testimonial-form";
import {
  deleteTestimonial,
  toggleTestimonialPublished,
} from "@/lib/admin/actions/testimonials";
import type { Paged } from "@/lib/admin/pagination";

/** The testimonial list and the drawer that edits it — PRD §12.6. */
export function TestimonialManager({
  page,
  nextSortOrder,
}: {
  page: Paged<TestimonialRecord>;
  nextSortOrder: number;
}) {
  return (
    <RecordList
      title="Testimoni"
      newLabel="Tambah testimoni"
      pathname="/admin/testimoni"
      page={page}
      label="testimoni"
      searchPlaceholder="Cari nama pelanggan atau isi testimoni…"
      headers={["Pelanggan", "Rating", "Urutan", "Status", "Aksi"]}
      emptyMessage="Belum ada testimoni. Website akan menampilkan copy umum sampai ada yang ditampilkan."
      addTitle="Tambah testimoni"
      editTitle="Ubah testimoni"
      describe={(testimonial) => testimonial.customerName}
      renderRow={(testimonial, edit) => (
        <AdminRow>
          <Cell className="max-w-md">
            <p className="font-semibold text-rhf-charcoal">
              {testimonial.customerName}
              {testimonial.customerType ? (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  · {testimonial.customerType}
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 line-clamp-1 text-muted-foreground">
              {testimonial.message}
            </p>
          </Cell>

          <Cell className="text-muted-foreground">
            {testimonial.rating ? (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Star aria-hidden className="size-3.5 text-rhf-gold" />
                {testimonial.rating}
              </span>
            ) : (
              "—"
            )}
          </Cell>

          <Cell className="tabular-nums text-muted-foreground">
            {testimonial.sortOrder}
          </Cell>

          <Cell>
            <PublishBadge isPublished={testimonial.isPublished} />
          </Cell>

          <RowActions
            recordName={testimonial.customerName}
            isPublished={testimonial.isPublished}
            togglePublish={toggleTestimonialPublished.bind(
              null,
              testimonial.id,
              !testimonial.isPublished,
            )}
            onEdit={edit}
            remove={deleteTestimonial.bind(null, testimonial.id)}
          />
        </AdminRow>
      )}
      renderForm={(testimonial, controls) => (
        <TestimonialForm
          testimonial={testimonial}
          nextSortOrder={nextSortOrder}
          {...controls}
        />
      )}
    />
  );
}
