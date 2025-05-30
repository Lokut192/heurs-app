export type TimezoneLabelProps = {
  children: React.ReactNode;
};

function TimezoneLabel({ children }: TimezoneLabelProps): React.ReactNode {
  return (
    <div className="grid max-w-[96rem] grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 md:grid-cols-3">
      <div>
        <h2 className="text-base-content text-base/7 font-semibold">
          Timezone
        </h2>
        <p className="text-base-content/80 mt-1 text-sm/6">
          Set here your timezone.
        </p>
      </div>

      {children}
    </div>
  );
}

export default TimezoneLabel as React.FC<TimezoneLabelProps>;
