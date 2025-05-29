export type PersonalInformationsLabelProps = {
  children: React.ReactNode;
};

function PersonalInformationsLabel({
  children,
}: PersonalInformationsLabelProps): React.ReactNode {
  return (
    <div className="grid max-w-[96rem] grid-cols-1 gap-x-8 gap-y-10 pb-4 sm:pb-6 md:grid-cols-3 lg:pb-8">
      <div>
        <h2 className="text-base-content text-base/7 font-semibold">
          Personal Informations
        </h2>
        <p className="text-base-content/80 mt-1 text-sm/6">
          Use a permanent address where you can receive mail.
        </p>
      </div>

      {children}
    </div>
  );
}

export default PersonalInformationsLabel as React.FC<PersonalInformationsLabelProps>;
