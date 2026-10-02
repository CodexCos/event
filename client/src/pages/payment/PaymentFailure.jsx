import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <Layout noSidebar>
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="glass-card p-8 bg-dark-900 border border-red-500/30 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center text-red-500">
            <XCircle size={44} />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Payment Cancelled / Failed
            </span>
            <h1 className="text-2xl font-extrabold text-dark-50">eSewa Payment Unsuccessful</h1>
            <p className="text-dark-300 text-sm leading-relaxed">
              Your transaction was cancelled or could not be completed by eSewa. No charges were made to your eSewa wallet.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={() => navigate('/events')}
            >
              <RefreshCw size={16} /> Try Registering Again
            </Button>
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => navigate('/events')}
            >
              <ArrowLeft size={16} /> Back to Events
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentFailure;
