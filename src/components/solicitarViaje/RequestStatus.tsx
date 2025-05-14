import { useState } from 'react';

interface RequestStatusProps {
    onCancel: () => void;
    userId: string | null;
}

const RequestStatus = ({ onCancel, userId }: RequestStatusProps) => {
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancelRide = async () => {
        if (!userId) return;
        
        try {
            setIsCancelling(true);
            
            // Call API to cancel the active ride request
            const response = await fetch(`http://localhost:5000/cancelar-solicitud/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cancelar la solicitud');
            }
            
            // Call the parent component's onCancel function
            onCancel();
        } catch (error) {
            console.error('Error cancelling ride request:', error);
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="p-8 text-center">
            <div className="mb-8">
                <div className="w-24 h-24 border-4 border-[#2D5DA1] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold text-[#4A4E69] mb-3">Tu solicitud ha sido enviada</h2>
            <p className="text-xl text-[#4A4E69]/80 mb-8">Te avisaremos cuando un conductor acepte tu solicitud</p>

            <div className="h-[400px] bg-[#F8F9FA] rounded-xl mb-8 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#4A4E69]/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span className="text-[#4A4E69]/60 text-lg">Mapa con ruta prevista</span>
                    </div>
                </div>
            </div>

            <button
                className="w-full bg-[#FF6B6B] text-white py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-[#FF6B6B]/90 transition-all duration-200 flex justify-center items-center"
                onClick={handleCancelRide}
                disabled={isCancelling}
            >
                {isCancelling ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cancelando...
                    </>
                ) : 'Cancelar Solicitud'}
            </button>
        </div>
    );
};

export default RequestStatus; 