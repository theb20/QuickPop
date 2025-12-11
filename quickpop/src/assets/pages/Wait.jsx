export default function Wait() {
  return (
    <div className="flex items-center bg-[url('/imgs/wall_cat.jpg')] object-cover before:content-[''] before:absolute before:inset-0 before:bg-black/50 h-[100vh] justify-center">
      <div className="logo absolute top-20 ms-20 w-[100px] left-0 text-5xl z-10 font-bold w-[600px]">
        <img src="/imgs/logo.png" alt="logo" className="w-full h-full inline-block" />
      </div>
      <div className="absolute left-0 ms-20 mt-20 text-5xl z-10 font-bold w-[600px]">
        <h1 className="text-white text-5xl z-10 font-bold w-[600px]">Un responsable prendra en charge votre demande.</h1>
        <p className="text-white text-2xl z-10 font-normal mt-5 w-[600px]">Une fois votre demande traitée, vous recevrez une notification par e-mail.</p>
        <div className="animate-spin mt-10 rounded-full h-10 w-10 border-b-2 border-red-600"> </div>
        
      </div>
    </div>
  );
}