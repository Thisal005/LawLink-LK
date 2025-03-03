import React from 'react';

const LawyerNotes = function() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
        <h2 className="text-xl font-semibold">LAWYER NOTES</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Document Review Notes</h3>
          <p className="text-sm text-gray-600">
            I reviewed the employment contract you uploaded. The non-compete clause seems overly restrictive and may not hold up in court. I suggest renegotiating this clause with your employer to avoid future disputes.
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Evidence Review</h3>
          <p className="text-sm text-gray-600">
            Reviewed the evidence provided on 2024.12.19. The witness statements strongly indicate regarding the faulty product. However, additional supporting documentation from the supplier will strengthen your case. Follow up with them to obtain the original invoice and warranty terms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LawyerNotes;
