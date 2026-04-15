"use client";

import type { CalendarDateTime, ZonedDateTime } from "@internationalized/date";
import { parseDateTime, toCalendarDateTime } from "@internationalized/date";
import { Calendar } from "@heroui/react/calendar";
import { DateField } from "@heroui/react/date-field";
import { DatePicker } from "@heroui/react/date-picker";
import { wizardTextFieldClass } from "./skill-wizard.ui";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Convierte el valor del formulario (`YYYY-MM-DDTHH:mm`) a `CalendarDateTime`. */
function localStringToDateTime(value: string): CalendarDateTime | null {
  const t = value.trim();
  if (!t || !t.includes("T")) return null;
  try {
    return parseDateTime(t);
  } catch {
    return null;
  }
}

function dateTimeToLocalString(d: CalendarDateTime): string {
  return `${d.year}-${pad2(d.month)}-${pad2(d.day)}T${pad2(d.hour)}:${pad2(d.minute)}`;
}

type PromoEndsAtPickerProps = {
  id?: string;
  labelId?: string;
  value: string;
  onChange: (localDatetime: string) => void;
  onBlur?: () => void;
  isInvalid?: boolean;
};

export function PromoEndsAtPicker({
  id = "skill-promo-ends",
  labelId,
  value,
  onChange,
  onBlur,
  isInvalid,
}: PromoEndsAtPickerProps) {
  const parsed = localStringToDateTime(value);

  return (
    <DatePicker
      id={id}
      aria-labelledby={labelId}
      granularity="minute"
      hourCycle={24}
      shouldForceLeadingZeros
      value={parsed}
      isInvalid={isInvalid}
      onChange={(next) => {
        if (next == null) {
          onChange("");
          return;
        }
        const wall: CalendarDateTime =
          typeof next === "object" && next !== null && "timeZone" in next
            ? toCalendarDateTime(next as ZonedDateTime)
            : (next as CalendarDateTime);
        onChange(dateTimeToLocalString(wall));
      }}
      className="flex w-full flex-col gap-2"
    >
      <DateField.Group
        onBlur={onBlur}
        className={`${wizardTextFieldClass} flex min-h-11 items-stretch rounded-xl border bg-white pr-1 ${
          isInvalid ? "border-accent-red" : "border-border"
        }`}
        fullWidth
        variant="secondary"
      >
        <DateField.Input className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 shadow-none focus-visible:ring-0">
          {(segment) => <DateField.Segment className="tabular-nums" segment={segment} />}
        </DateField.Input>
        <DateField.Suffix className="flex items-center">
          <DatePicker.Trigger
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-primary transition hover:bg-primary/10"
            aria-label="Abrir calendario"
          >
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DatePicker.Popover className="max-h-[min(90vh,520px)] overflow-y-auto rounded-2xl p-2 shadow-lg">
        <Calendar aria-label="Elige fecha y hora de fin de la oferta">
          <Calendar.Header className="flex flex-wrap items-center gap-2 px-1 pb-2">
            <Calendar.YearPickerTrigger className="rounded-lg px-2 py-1 text-sm font-semibold">
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.Heading className="min-w-0 flex-1 text-center text-sm font-semibold capitalize" />
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid className="[&_td]:p-0.5 [&_th]:p-1">
            <Calendar.GridHeader>
              {(day) => (
                <Calendar.HeaderCell className="text-[11px] font-semibold uppercase text-muted">
                  {day}
                </Calendar.HeaderCell>
              )}
            </Calendar.GridHeader>
            <Calendar.GridBody>{(date) => <Calendar.Cell className="rounded-lg text-sm" date={date} />}</Calendar.GridBody>
          </Calendar.Grid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
}
