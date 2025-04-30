export default function Header() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <p className="text-blue-500">
        Please upload PDF files to extract CV data.
      </p>
      <p className="text-blue-500 mt-1">
        Maximum processing limit is 10 files at a time, each file representative
        as 1 IT Talent.
      </p>
    </div>
  );
}
