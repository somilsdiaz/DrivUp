interface MapPreviewProps {
    title?: string;
}

const MapPreview = ({ title = "Mapa con ruta prevista" }: MapPreviewProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-[400px] bg-[#F8F9FA] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#4A4E69]/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span className="text-[#4A4E69]/60 text-lg">{title}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPreview; 