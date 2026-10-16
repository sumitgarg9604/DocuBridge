import React, { useState } from 'react';
import { PRESET_APPLICANTS } from './data/presetApplicants';
import { ApplicantCase, DocRecord, DocType } from './types/docubridge';
import { Header } from './components/Header';
import { CustomerPortal } from './components/CustomerPortal';
import { StaffConsole } from './components/StaffConsole';
import { DemoGuideModal } from './components/DemoGuideModal';
import { RequestInfoModal } from './components/RequestInfoModal';
import { UploadCustomDocModal } from './components/UploadCustomDocModal';

export default function App() {
  const [cases, setCases] = useState<ApplicantCase[]>(PRESET_APPLICANTS);
  const [currentCaseId, setCurrentCaseId] = useState<string>('APP-2026-IN-8491'); // Priya Sharma by default
  const [viewMode, setViewMode] = useState<'customer' | 'staff'>('customer');
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState<boolean>(false);
  const [requestInfoDocType, setRequestInfoDocType] = useState<string>('Form 16 or Latest ITR');
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);

  const currentCase = cases.find((c) => c.id === currentCaseId) || cases[0];

  const handleSelectCase = (c: ApplicantCase) => {
    setCurrentCaseId(c.id);
  };

  const handleUpdateCase = (updated: ApplicantCase) => {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  // Handler for Demo Guide steps
  const handleStepSelect = (stepNumber: number) => {
    setCurrentDemoStep(stepNumber);

    if (stepNumber === 1) {
      // Step 1: Customer Phone Upload & Tamil Voice Note
      setViewMode('customer');
      setCurrentCaseId('APP-2026-IN-8491');
    } else if (stepNumber === 2) {
      // Step 2: Quality feedback (blurry warning -> clean retake)
      setViewMode('customer');
      setCurrentCaseId('APP-2026-IN-8491');
    } else if (stepNumber === 3) {
      // Step 3: Staff Console Complete view with source citation
      setViewMode('staff');
      setCurrentCaseId('APP-2026-IN-8491');
    } else if (stepNumber === 4) {
      // Step 4: Vikram Malhotra (Forged slip arithmetic & bank mismatch)
      setViewMode('staff');
      setCurrentCaseId('APP-2026-IN-7319');
    } else if (stepNumber === 5) {
      // Step 5: Rajesh Verma (Adversarial Prompt Injection)
      setViewMode('staff');
      setCurrentCaseId('APP-2026-IN-9124');
    } else if (stepNumber === 6) {
      // Step 6: Officer drafts request for missing Form 16 in native language
      setViewMode('staff');
      setCurrentCaseId('APP-2026-IN-8491');
      setRequestInfoDocType('Form 16 / Latest ITR');
      setIsRequestInfoOpen(true);
    }
  };

  const handleOpenRequestInfo = (docType: string) => {
    setRequestInfoDocType(docType);
    setIsRequestInfoOpen(true);
  };

  const handleDocumentProcessed = (doc: DocRecord) => {
    const updatedCase = { ...currentCase };
    updatedCase.documents = {
      ...updatedCase.documents,
      [doc.docType]: doc,
    };

    // Recalculate basic status
    const allDocs = Object.values(updatedCase.documents).filter(Boolean);
    const hasHighFlag = allDocs.some((d) => d?.flags.some((f) => f.severity === 'High'));
    if (hasHighFlag) {
      updatedCase.status = 'Needs review';
      updatedCase.riskLevel = 'High';
    }

    handleUpdateCase(updatedCase);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        cases={cases}
        currentCase={currentCase}
        onSelectCase={handleSelectCase}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 overflow-auto">
        {viewMode === 'customer' ? (
          <CustomerPortal
            currentCase={currentCase}
            onUpdateCase={handleUpdateCase}
            onSwitchToStaffConsole={() => setViewMode('staff')}
          />
        ) : (
          <StaffConsole
            cases={cases}
            currentCase={currentCase}
            onSelectCase={handleSelectCase}
            onUpdateCase={handleUpdateCase}
            onRequestInfoModal={handleOpenRequestInfo}
          />
        )}
      </main>

      {/* Modals */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onStepSelect={handleStepSelect}
        currentStep={currentDemoStep}
      />

      <RequestInfoModal
        isOpen={isRequestInfoOpen}
        onClose={() => setIsRequestInfoOpen(false)}
        applicant={currentCase}
        defaultDocType={requestInfoDocType}
      />

      <UploadCustomDocModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentProcessed={handleDocumentProcessed}
      />
    </div>
  );
}
