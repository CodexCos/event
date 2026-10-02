import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight, Ticket, Calendar, MapPin, Receipt } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import { verifyEsewaPayment } from '../../services/paymentService';
import { useToast } from '../../context/ToastContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (!data) {
      setLoading(false);
      setError('No payment verification payload found.');
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEsewaPayment(data);
        setSuccess(true);
        setDetails(res);
        toast.success('Payment Verified!', 'Your ticket has been booked successfully.');
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.message || 'Payment verification failed.');
        toast.error('Verification Failed', err.message);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <Layout noSidebar>
      <div className="max-w-xl mx-auto py-12 px-4">
        {loading ? (
          <div className="glass-card p-10 bg-dark-900 border border-dark-700 text-center space-y-4">
            <Spinner size="lg" className="mx-auto text-emerald-500" />
            <h2 className="text-xl font-bold text-dark-50">Verifying eSewa Payment...</h2>
            <p className="text-dark-400 text-sm">Please wait while we confirm your payment transaction with eSewa.</p>
          </div>
        ) : error ? (
          <div className="glass-card p-8 bg-dark-900 border border-red-500/30 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-red-400">Verification Issue</h2>
              <p className="text-dark-300 text-sm mt-2">{error}</p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <Button onClick={() => navigate('/events')}>Browse Events</Button>
              <Button variant="secondary" onClick={() => navigate('/participant/registrations')}>My Registrations</Button>
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 bg-dark-900 border border-emerald-500/30 shadow-2xl relative overflow-hidden space-y-6">
            {/* Top eSewa Badge accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-3">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 animate-bounce-short">
                <CheckCircle2 size={44} />
              </div>
              <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                eSewa Payment Successful
              </span>
              <h1 className="text-3xl font-extrabold text-dark-50">Booking Confirmed!</h1>
              <p className="text-dark-300 text-sm">Your payment was processed successfully. We look forward to seeing you at the event!</p>
            </div>

            {/* Receipt / Details Box */}
            {details && (
              <div className="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-5 space-y-4">
                {details.event && (
                  <div className="flex items-center gap-4 pb-4 border-b border-dark-700/60">
                    <img
                      src={details.event.imageUrl || details.event.image_url}
                      alt={details.event.title}
                      className="w-16 h-16 object-cover rounded-xl border border-dark-700"
                    />
                    <div>
                      <h3 className="font-extrabold text-dark-50 text-base">{details.event.title}</h3>
                      <p className="text-xs text-dark-400 flex items-center gap-1.5 mt-1 font-semibold">
                        <Calendar size={13} className="text-primary-500" />
                        {new Date(details.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {details.event.time && ` · ${details.event.time}`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-dark-300">
                    <span className="text-dark-400 font-semibold">Amount Paid</span>
                    <span className="font-extrabold text-emerald-400 text-sm">
                      Rs. {details.payment?.amount || details.event?.price}
                    </span>
                  </div>
                  <div className="flex justify-between text-dark-300">
                    <span className="text-dark-400 font-semibold">Payment Method</span>
                    <span className="font-bold text-dark-200">eSewa Mobile Wallet</span>
                  </div>
                  <div className="flex justify-between text-dark-300">
                    <span className="text-dark-400 font-semibold">eSewa Ref ID</span>
                    <span className="font-mono text-dark-200 font-bold">{details.payment?.esewaRefId || details.payment?.esewa_ref_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-dark-300">
                    <span className="text-dark-400 font-semibold">Transaction UUID</span>
                    <span className="font-mono text-dark-400">{details.payment?.transactionUuid || details.payment?.transaction_uuid}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => navigate('/participant/registrations')}
              >
                <Ticket size={16} /> My Registrations
              </Button>
              <Button
                variant="secondary"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => navigate('/events')}
              >
                Browse More Events <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
