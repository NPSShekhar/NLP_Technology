import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, Globe, Crop } from "lucide-react";
import Select from "react-select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {

  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";
import PopupImageCropper from "../components/PopupImageCropper";
import PopupPreviewModal from "../components/PopupPreviewModal";
import AdminLogin from "./AdminLogin";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("popup");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.4;
  const speedY = 0.4;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();

    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#FFFFFF] px-4 py-8 md:px-8 lg:px-12"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-100">
          <ContactGridPattern
            offsetX={gridOffsetX}
            offsetY={gridOffsetY}
            active={false}
          />
        </div>

        <motion.div
          className="absolute inset-0 opacity-100"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <ContactGridPattern
            offsetX={gridOffsetX}
            offsetY={gridOffsetY}
            active={true}
          />
        </motion.div>
      </div>

      <div className="responsive-container relative z-10 mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 rounded-[20px] bg-[#2A2E34] px-6 py-6 text-[#FFFFFF] md:flex-row md:items-center md:justify-between md:px-8">
          <div>
           <p className="mb-2 inline-flex items-center gap-3 font-['DM_Sans'] text-[15px] md:text-[16px] lg:text-[17px] font-semibold uppercase tracking-[1.5px] text-[#00B2F9]">
  <span className="block w-[30px] h-[1px] bg-[#00B2F9] flex-shrink-0"></span>
  NLP Technology
</p>

            <h1 className="font-['Space_Grotesk'] text-[20px] font-bold md:text-[32px] lg:text-[38px]">
              Content Management
            </h1>

            <p className="mt-2 font-['DM_Sans'] text-[15px]  text-[#CBD5E1] md:text-[18px]">
              Add, update and delete Banners, Products & Services and Social Media Content.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:flex-col md:items-center lg:flex-row">
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="inline-flex h-[44px] w-fit shrink-0 whitespace-nowrap items-center gap-2 justify-center rounded-[12px] border border-[#64748B] bg-transparent px-6 font-['DM_Sans'] text-[15px] md:text-[18px] font-medium text-[#FFFFFF] transition-all duration-300 ease-out hover:bg-[#FFFFFF] hover:text-[#2A2E34] hover:scale-[1.04] active:scale-95 shadow-md"  >
              <LogOut size={18} />
              Logout
            </button>

           <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 h-[44px] px-6 min-w-[190px] rounded-xl bg-[#00B2F9] text-white font-medium hover:bg-[#0EA5E9] transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md whitespace-nowrap"
      >
        <Globe className="w-[18px] h-[18px] shrink-0 flex-none" />
        <span>Back to website</span>
      </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-nowrap gap-3 overflow-x-auto rounded-[16px] bg-[#EEF6FD] p-3 shadow-md" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            type="button"
            onClick={() => setActiveTab("popup")}
            className={`flex-shrink-0 whitespace-nowrap h-[44px] rounded-[12px] border px-6 font-['DM_Sans'] text-[16px] md:text-[18px] font-semibold transition ${
              activeTab === "popup"
                ? "bg-[#00B2F9] text-white"
                : "bg-[#FFFFFF] text-[#2A2E34] hover:bg-[#c4e1f8]"
            }`}
          >
            Banner
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`flex-shrink-0 whitespace-nowrap h-[44px] border rounded-[12px] px-6 font-['DM_Sans'] text-[16px] md:text-[18px] font-semibold transition ${
              activeTab === "services"
                ? "bg-[#00B2F9] text-white"
                : "bg-[#FFFFFF] text-[#2A2E34] hover:bg-[#c4e1f8]"
            }`}
          >
            Products & Services
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`flex-shrink-0 whitespace-nowrap h-[44px] border rounded-[12px] px-6 font-['DM_Sans'] text-[16px] md:text-[18px] font-semibold transition ${
              activeTab === "social"
                ? "bg-[#00B2F9] text-white"
                : "bg-[#FFFFFF] text-[#2A2E34] hover:bg-[#c4e1f8]"
            }`}
          >
            Social Media
          </button>
        </div>

        {activeTab === "services" ? (
          <ServicesManager />
        ) : activeTab === "social" ? (
          <SocialLinksManager />
        ) : (
          <PopupBannerManager />
        )}
      </div>
    </div>
  );
}

function ServicesFormToggle({ value, onChange }) {
  return (
    <div className="relative mb-6 flex h-[48px] rounded-[12px] bg-[#00B2F9] p-1">
      <span
        aria-hidden="true"
        className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-[12px] bg-white transition-[left] duration-300 ease-in-out"
        style={{
          left: value === "services" ? "4px" : "calc(50%)",
        }}
      />

      <button
        type="button"
        onClick={() => onChange("services")}
        className={`relative z-10 flex-1 rounded-[12px] font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold transition-colors ${
          value === "services" ? "text-[#00B2F9]" : "text-white"
        }`}
      >
        Services
      </button>

      <button
        type="button"
        onClick={() => onChange("products")}
        className={`relative z-10 flex-1 rounded-[12px] font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold transition-colors ${
          value === "products" ? "text-[#00B2F9]" : "text-white"
        }`}
      >
        Products
      </button>
    </div>
  );
}

function ServicesManager() {
  const initialForm = {
    title: "",
    description: "",
    link_text: "",
    sort_order: "",
  };

  const initialProductForm = {
    service_id: "",
    title: "",
    description: "",
  };

  const [services, setServices] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [image, setImage] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [productPreview, setProductPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [productFileInputKey, setProductFileInputKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productError, setProductError] = useState("");
  const [productSuccess, setProductSuccess] = useState("");
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [activeFormType, setActiveFormType] = useState("services");

  const relatedProductFormRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [servicesResponse, relatedProductsResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/services`),
          fetch(`${API_URL}/api/related-products`),
        ]);

      const servicesData = await servicesResponse.json();
      const relatedProductsData =
        await relatedProductsResponse.json();

      if (!servicesResponse.ok) {
        throw new Error(
          servicesData.message || "Failed to fetch services."
        );
      }

      if (!relatedProductsResponse.ok) {
        throw new Error(
          relatedProductsData.message ||
            "Failed to fetch related products."
        );
      }

      setServices(
        Array.isArray(servicesData.services) ? servicesData.services : []
      );
      setRelatedProducts(
        Array.isArray(relatedProductsData.related_products)
          ? relatedProductsData.related_products
          : []
      );
    } catch (fetchError) {
      console.error("Fetch services error:", fetchError);

      setError(
        fetchError.message || "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      setImage(null);
      return;
    }

    setImage(selectedImage);
    setPreview(URL.createObjectURL(selectedImage));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImage(null);
    setPreview("");
    setEditingId(null);
    setError("");
    setFileInputKey((currentKey) => currentKey + 1);
  };

  const handleEdit = (service) => {
    setEditingId(service.id);

    setForm({
      title: service.title || "",
      description: service.description || "",
      link_text: service.link_text || "",
      sort_order:
        service.sort_order !== undefined &&
        service.sort_order !== null
          ? String(service.sort_order)
          : "",
    });

    setImage(null);
    setPreview(service.image || "");
    setError("");
    setSuccess("");
    setActiveFormType("services");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Product & Service title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Product & Service description is required.");
      return;
    }

    if (!form.link_text.trim()) {
      setError("Product & Service text is required.");
      return;
    }

    if (!editingId && !image) {
      setError("Product & Service image is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append(
        "link_text",
        form.link_text.trim()
      );

      if (form.sort_order.trim()) {
        formData.append("sort_order", form.sort_order.trim());
      }

      if (image) {
        formData.append("image", image);
      }

      const requestUrl = editingId
        ? `${API_URL}/api/services/${editingId}`
        : `${API_URL}/api/services`;

      const response = await fetch(requestUrl, {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save service."
        );
      }

      setSuccess(
        editingId
          ? "Service updated successfully."
          : "Service added successfully."
      );

      resetForm();
      await fetchData();
    } catch (submitError) {
      console.error("Save Product & Service error:", submitError);

      setError(
        submitError.message || "Unable to save service."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (service) => {
    setServiceToDelete(service);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    const service = serviceToDelete;

    try {
      setDeletingId(service.id);
      setError("");
      setSuccess("");
      setServiceToDelete(null);

      const response = await fetch(
        `${API_URL}/api/services/${service.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete service."
        );
      }

      if (editingId === service.id) {
        resetForm();
      }

      setSuccess("Service deleted successfully.");
      await fetchData();
    } catch (deleteError) {
      console.error("Delete Service error:", deleteError);

      setError(
        deleteError.message || "Unable to delete service."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleProductInputChange = (event) => {
    const { name, value } = event.target;

    setProductForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleProductImageChange = (event) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      setProductImage(null);
      return;
    }

    setProductImage(selectedImage);
    setProductPreview(URL.createObjectURL(selectedImage));
  };

  const resetProductForm = () => {
    setProductForm(initialProductForm);
    setProductImage(null);
    setProductPreview("");
    setEditingProductId(null);
    setProductError("");
    setProductFileInputKey((currentKey) => currentKey + 1);
  };

  const scrollToRelatedProductForm = () => {
    relatedProductFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);

    setProductForm({
      service_id: String(product.service_id || ""),
      title: product.title || "",
      description: product.description || "",
    });

    setProductImage(null);
    setProductPreview(product.image || "");
    setProductError("");
    setProductSuccess("");
    setActiveFormType("products");

    window.setTimeout(scrollToRelatedProductForm, 0);
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    if (!productForm.service_id) {
      setProductError("Services category is required.");
      return;
    }

    if (!productForm.title.trim()) {
      setProductError("Product title is required.");
      return;
    }

    if (!productForm.description.trim()) {
      setProductError("Product description is required.");
      return;
    }

    if (!editingProductId && !productImage) {
      setProductError("Product image is required.");
      return;
    }

    try {
      setProductSubmitting(true);
      setProductError("");
      setProductSuccess("");

      const formData = new FormData();

      formData.append("service_id", productForm.service_id);
      formData.append("title", productForm.title.trim());
      formData.append("description", productForm.description.trim());

      if (productImage) {
        formData.append("image", productImage);
      }

      const requestUrl = editingProductId
        ? `${API_URL}/api/related-products/${editingProductId}`
        : `${API_URL}/api/related-products`;

      const response = await fetch(requestUrl, {
        method: editingProductId ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save related product."
        );
      }

      setProductSuccess(
        editingProductId
          ? "Related product updated successfully."
          : "Related product added successfully."
      );

      resetProductForm();
      await fetchData();
    } catch (submitError) {
      console.error("Save related product error:", submitError);

      setProductError(
        submitError.message || "Unable to save related product."
      );
    } finally {
      setProductSubmitting(false);
    }
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    const product = productToDelete;

    try {
      setDeletingProductId(product.id);
      setProductError("");
      setProductSuccess("");
      setProductToDelete(null);

      const response = await fetch(
        `${API_URL}/api/related-products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete related product."
        );
      }

      if (editingProductId === product.id) {
        resetProductForm();
      }

      setProductSuccess("Related product deleted successfully.");
      await fetchData();
    } catch (deleteError) {
      console.error("Delete related product error:", deleteError);

      setProductError(
        deleteError.message || "Unable to delete related product."
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_minmax(0,1fr)] xl:items-start">
      {serviceToDelete && (
        <DeleteConfirmModal
          title="Delete Service"
          message={`Are you sure you want to delete "${serviceToDelete.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setServiceToDelete(null)}
          isDeleting={deletingId === serviceToDelete.id}
        />
      )}
      {productToDelete && (
        <DeleteConfirmModal
          title="Delete Related Product"
          message={`Are you sure you want to delete "${productToDelete.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteProduct}
          onCancel={() => setProductToDelete(null)}
          isDeleting={deletingProductId === productToDelete.id}
        />
      )}
      <div className="flex flex-col xl:sticky xl:top-8">
      <section
        ref={relatedProductFormRef}
        className="h-fit rounded-[20px] bg-[#EEF6FD] p-6 shadow-md md:p-8"
      >
        <ServicesFormToggle
          value={activeFormType}
          onChange={setActiveFormType}
        />

        {activeFormType === "services" ? (
          <>
        <div className="mb-6">
          

          <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
            {editingId
              ? "Edit Service"
              : "Add New Service"}
          </h2>
        </div>

        <StatusMessage error={error} success={success} />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <FormField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Enter title"
          />

          <div>
            <label className="mb-2 block font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-[#2A2E34]">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={6}
              placeholder="Enter description"
              className="w-full resize-none rounded-[12px] border border-[#DCE3EA] bg-white px-4 py-3 font-['DM_Sans'] text-[15px] text-[#2A2E34] outline-none transition focus:border-[#00B2F9] focus:ring-2 focus:ring-[#00B2F9]/15"
            />
          </div>

          <FormField
            label="Text"
            name="link_text"
            value={form.link_text}
            onChange={handleInputChange}
            placeholder="Example: Dedicated Support, Wherever You Are"
          />

          <FormField
            label="Order"
            name="sort_order"
            value={form.sort_order}
            onChange={handleInputChange}
            placeholder="Example: 1"
            type="number"
          />

          <div>
            <label className="mb-2 block font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-[#2A2E34]">
              Image
            </label>

            <input
              key={fileInputKey}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
              className="w-full rounded-[12px] border border-[#DCE3EA] bg- px-3 py-3 font-['DM_Sans'] hover:underline text-[14px] text-[#64748B] file:mr-4 file:rounded-[8px] bg-[#FFFFFF] file:border-0 file:bg-[#EEF6FD] file:px-4 file:py-2 file:font-semibold file:text-[#00B2F9]"
            />

            {editingId && (
              <p className="mt-2 font-['DM_Sans'] text-[12px] text-[#64748B] ">
                Select a new image only when replacing the
                existing image.
              </p>
            )}
          </div>

          {preview && (
            <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0]">
              <img
                src={preview}
                alt="Service preview"
                className="h-[220px] w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#00B2F9] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update"
                  : "Add"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] items-center justify-center rounded-[12px] bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-[#2A2E34] transition hover:bg-[#c4e1f8]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
          </>
        ) : (
          <>
        <div className="mb-6">
        

          <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
            {editingProductId
              ? "Edit Related Product"
              : "Add Related Product"}
          </h2>
        </div>

        <StatusMessage error={productError} success={productSuccess} />

        <form
          onSubmit={handleProductSubmit}
          className="flex flex-col gap-5"
        >
       <div>
  <label className="mb-2 block font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-[#2A2E34]">
    Services Category
  </label>

<Select
  options={[
    { value: "", label: "Select service" },
    ...services.map((service) => ({
      value: service.id,
      label:
        service.title.length > 40
          ? `${service.title.slice(0, 40)}...`
          : service.title,
    })),
  ]}
  value={
    [
      { value: "", label: "Select service" },
      ...services.map((service) => ({
        value: service.id,
        label:
          service.title.length > 40
            ? `${service.title.slice(0, 40)}...`
            : service.title,
      })),
    ].find(
      (option) => String(option.value) === String(productForm.service_id)
    ) || null
  }
  onChange={(selected) =>
    handleProductInputChange({
      target: {
        name: "service_id",
        value: selected?.value || "",
      },
    })
  }
  styles={{
    control: (base, state) => ({
      ...base,
      minHeight: "46px",
      borderRadius: "12px",
      borderColor: state.isFocused ? "#00B2F9" : "#DCE3EA",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(0,178,249,0.15)"
        : "none",
      "&:hover": {
        borderColor: "#00B2F9",
      },
      fontFamily: "DM Sans",
      fontSize: "15px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingRight: "16px",
    }),
  }}
/>
</div>
          <FormField
          
            label="Title"
            name="title"
            value={productForm.title}
            onChange={handleProductInputChange}
            placeholder="Enter product title"
          />

          <div>
            <label className="mb-2 block font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-[#2A2E34]">
              Description
            </label>

            <textarea
              name="description"
              value={productForm.description}
              onChange={handleProductInputChange}
              rows={6}
              placeholder="Enter description"
              className="w-full resize-none rounded-[12px] border border-[#DCE3EA] bg-white px-4 py-3 font-['DM_Sans'] text-[15px] text-[#2A2E34] outline-none transition focus:border-[#00B2F9] focus:ring-2 focus:ring-[#00B2F9]/15"
            />
          </div>

          <div>
            <label className="mb-2 block font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-[#2A2E34]">
              Image
            </label>

            <input
              key={productFileInputKey}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleProductImageChange}
              className="w-full rounded-[12px] border border-[#DCE3EA] bg- px-3 py-3 font-['DM_Sans'] hover:underline text-[14px] text-[#64748B] file:mr-4 file:rounded-[8px] bg-[#FFFFFF] file:border-0 file:bg-[#EEF6FD] file:px-4 file:py-2 file:font-semibold file:text-[#00B2F9]"
            />

            {editingProductId && (
              <p className="mt-2 font-['DM_Sans'] text-[12px] text-[#64748B] ">
                Select a new image only when replacing the
                existing image.
              </p>
            )}
          </div>

          {productPreview && (
            <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0]">
              <img
                src={productPreview}
                alt="Related product preview"
                className="h-[220px] w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={productSubmitting}
              className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#00B2F9] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {productSubmitting
                ? "Saving..."
                : editingProductId
                  ? "Update"
                  : "Add"}
            </button>

            {editingProductId && (
              <button
                type="button"
                onClick={resetProductForm}
                className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] items-center justify-center rounded-[12px] bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-[#2A2E34] transition hover:bg-[#c4e1f8]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
          </>
        )}
      </section>
      </div>

      {/* Services list */}
      <section className="min-w-0 w-full xl:sticky xl:top-8 xl:max-h-[calc(120vh-4rem)] xl:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <div>
    
    <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
      Manage Products & Services
    </h2>
  </div>

  <span className="w-fit rounded-full bg-[#2A2E34] px-4 py-2 font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-white">
    {services.length} Services
  </span>
</div>

        {loading ? (
          <LoadingMessage text="Loading Products & Services..." />
        ) : services.length === 0 ? (
          <EmptyMessage text="No Products & Services available." />
        ) : (
          <div className="flex flex-col gap-10">
            {services.map((service, index) => (
              <article
                key={service.id}
                className="rounded-[22px] bg-[#EEF6FD] p-5 md:p-6 lg:p-7 shadow-md"
              >
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                  <div
                    className={`overflow-hidden rounded-[16px] ${
                      index % 2 === 0
                        ? "lg:order-1"
                        : "lg:order-2"
                    }`}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-[240px] w-full object-cover md:h-[290px] lg:h-[360px]"
                    />
                  </div>

                  <div
                    className={`flex flex-col ${
                      index % 2 === 0
                        ? "lg:order-2"
                        : "lg:order-1"
                    }`}
                  >
                    <span className="mb-5 font-['Space_Grotesk'] text-[52px] font-bold leading-none text-[#2A2E34]/15 md:text-[62px]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="mb-4 font-['Space_Grotesk'] text-[21px] font-bold leading-[1.3] text-[#2A2E34] md:text-[24px]">
                      {service.title}
                    </h3>

                    <p className="mb-6 font-['DM_Sans'] text-[14px] leading-[1.8] text-[#64748B] md:text-[16px]">
                      {service.description}
                    </p>

                    <p className="inline-flex items-center gap-3 font-['DM_Sans'] text-[12px] font-bold uppercase tracking-[1.2px] text-[#00B2F9] md:text-[14px]">
                      <span className="block h-[2px] w-[24px] flex-shrink-0 bg-[#00B2F9]"></span>
                      {service.link_text}
                    </p>

                    <p className="mt-4 font-['DM_Sans'] text-[13px] md:text-[15px] font-semibold text-[#64748B]">
                      Order: {service.sort_order ?? index + 1}
                    </p>

                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(service)}
                        className="inline-flex h-[42px] flex-1 items-center justify-center rounded-[10px] bg-[#FFFFFF] px-4 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => confirmDelete(service)}
                        disabled={deletingId === service.id}
                        className="inline-flex h-[42px] flex-1 items-center justify-center rounded-[10px] bg-[#FEECEC] px-4 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-[#DC2626] transition hover:bg-[#FDDDDD] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === service.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>

                {relatedProducts.filter(
                  (product) => product.service_id === service.id
                ).length > 0 && (
                  <div className="mt-8 min-w-0 border-t border-[#D7E6F3] pt-8">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-['Space_Grotesk'] font-semibold text-[21px] md:text-[24px] text-[#2A2E34]">
                    Related Products
                  </p>

                  <span className="w-fit rounded-full bg-[#2A2E34] px-4 py-2 font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-white">
                    {
                      relatedProducts.filter(
                        (product) => product.service_id === service.id
                      ).length
                    } Products
                  </span>
                </div>
                  
                    <AdminRelatedProductsRow
                      products={relatedProducts.filter(
                        (product) => product.service_id === service.id
                      )}
                      onEdit={handleEditProduct}
                      onDelete={confirmDeleteProduct}
                      deletingProductId={deletingProductId}
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AdminRelatedProductsRow({
  products,
  onEdit,
  onDelete,
  deletingProductId,
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth <
        container.scrollWidth - 1
    );
  };

  useEffect(() => {
    updateScrollState();

    const container = scrollRef.current;

    if (!container) {
      return undefined;
    }

    container.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products]);

  const scrollByDirection = (direction) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const card = container.querySelector("[data-admin-related-card]");

    if (!card) {
      return;
    }

    const gap = 24;
    const scrollAmount = card.offsetWidth + gap;

    container.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

const showArrows =
  window.innerWidth < 640
    ? products.length > 1
    : window.innerWidth < 1024
    ? products.length > 2
    : products.length > 4;

  return (
    <div className="min-w-0 w-full">
      <div
        ref={scrollRef}
        className="flex gap-5 md:gap-6 overflow-hidden scroll-smooth"
        onWheel={(event) => event.preventDefault()}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-admin-related-card
            className="flex h-auto md:h-[360px] flex-shrink-0 flex-col w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] bg-[#FFFFFF] rounded-[14px] overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.06)]"
          >
            <div className="w-full aspect-[16/9] shrink-0 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h4 className="mb-2 line-clamp-2 min-h-[2.75rem] font-['Space_Grotesk'] text-[15px] md:text-[17px] font-bold leading-snug text-[#2A2E34]">
                {product.title}
              </h4>

              <p className="mb-4 line-clamp-3 min-h-[3.75rem] flex-1 font-['DM_Sans'] text-[13px] md:text-[15px] leading-relaxed text-[#3E4850]">
                {product.description}
              </p>

              <div className="mt-auto flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="inline-flex h-[38px] flex-1 items-center justify-center rounded-[10px] bg-[#EEF6FD] px-3 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  disabled={deletingProductId === product.id}
                  className="inline-flex h-[38px] flex-1 items-center justify-center rounded-[10px] bg-[#FEECEC] px-3 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-[#DC2626] transition hover:bg-[#FDDDDD] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingProductId === product.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showArrows && (
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByDirection(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous related products"
            className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FFFFFF] text-[#00B2F9] shadow-[0px_4px_20px_rgba(0,0,0,0.06)] transition hover:bg-[#EEF6FD] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => scrollByDirection(1)}
            disabled={!canScrollRight}
            aria-label="Next related products"
            className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FFFFFF] text-[#00B2F9] shadow-[0px_4px_20px_rgba(0,0,0,0.06)] transition hover:bg-[#EEF6FD] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

function SocialLinksManager() {
  const initialForm = {
    platform: "",
    url: "",
    sort_order: "",
  };

  const platformOptions = [
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter" },
    { value: "youtube", label: "YouTube" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
  ];

  const [socialLinks, setSocialLinks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [linkToDelete, setLinkToDelete] = useState(null);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/social-links`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch social links."
        );
      }

      setSocialLinks(
        Array.isArray(data.social_links) ? data.social_links : []
      );
    } catch (fetchError) {
      console.error("Fetch social links error:", fetchError);

      setError(
        fetchError.message || "Unable to load social links."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const getPlatformLabel = (platform) => {
    const match = platformOptions.find(
      (option) => option.value === platform
    );

    return match?.label || platform;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  const handleEdit = (link) => {
    setEditingId(link.id);

    setForm({
      platform: link.platform || "",
      url: link.url || "",
      sort_order:
        link.sort_order !== undefined && link.sort_order !== null
          ? String(link.sort_order)
          : "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.platform) {
      setError("Social media platform is required.");
      return;
    }

    if (!form.url.trim()) {
      setError("Social media URL is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        platform: form.platform,
        url: form.url.trim(),
      };

      if (form.sort_order.trim()) {
        payload.sort_order = form.sort_order.trim();
      }

      const requestUrl = editingId
        ? `${API_URL}/api/social-links/${editingId}`
        : `${API_URL}/api/social-links`;

      const response = await fetch(requestUrl, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save social link."
        );
      }

      setSuccess(
        editingId
          ? "Social link updated successfully."
          : "Social link added successfully."
      );

      resetForm();
      await fetchSocialLinks();
    } catch (submitError) {
      console.error("Save social link error:", submitError);

      setError(
        submitError.message || "Unable to save social link."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (link) => {
    setLinkToDelete(link);
  };

  const handleDelete = async () => {
    if (!linkToDelete) return;
    const link = linkToDelete;

    try {
      setDeletingId(link.id);
      setError("");
      setSuccess("");
      setLinkToDelete(null);

      const response = await fetch(
        `${API_URL}/api/social-links/${link.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete social link."
        );
      }

      if (editingId === link.id) {
        resetForm();
      }

      setSuccess("Social link deleted successfully.");
      await fetchSocialLinks();
    } catch (deleteError) {
      console.error("Delete social link error:", deleteError);

      setError(
        deleteError.message || "Unable to delete social link."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_minmax(0,1fr)] xl:items-start">
      {linkToDelete && (
        <DeleteConfirmModal
          title="Delete Social Link"
          message={`Are you sure you want to delete the ${getPlatformLabel(linkToDelete.platform)} link? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setLinkToDelete(null)}
          isDeleting={deletingId === linkToDelete.id}
        />
      )}

      <div className="xl:sticky xl:top-8">
      <section className="h-fit rounded-[20px] bg-[#EEF6FD] p-6 shadow-md md:p-8">
        <div className="mb-6">
        

          <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
            {editingId
              ? "Edit Social Media Link"
              : "Add Social Media Link"}
          </h2>
        </div>

        <StatusMessage error={error} success={success} />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
       <div>
  <label className="mb-2 block font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-[#2A2E34]">
    Platform
  </label>

  <Select
  options={[
    { value: "", label: "Select platform" },
    ...platformOptions.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ]}
  value={
    [
      { value: "", label: "Select platform" },
      ...platformOptions.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    ].find((option) => option.value === form.platform) || null
  }
  onChange={(selected) =>
    handleInputChange({
      target: {
        name: "platform",
        value: selected?.value || "",
      },
    })
  }
  styles={{
    control: (base, state) => ({
      ...base,
      minHeight: "46px",
      borderRadius: "12px",
      borderColor: state.isFocused ? "#00B2F9" : "#DCE3EA",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(0,178,249,0.15)"
        : "none",
      "&:hover": {
        borderColor: "#00B2F9",
      },
      fontFamily: "DM Sans",
      fontSize: "15px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingRight: "16px",
    }),
  }}
/>
</div>
          <FormField
            label="URL"
            name="url"
            value={form.url}
            onChange={handleInputChange}
            placeholder="https://www.linkedin.com/company/example"
          />

          <FormField
            label="Order"
            name="sort_order"
            value={form.sort_order}
            onChange={handleInputChange}
            placeholder="Example: 1"
            type="number"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#00B2F9] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update"
                  : "Add"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] items-center justify-center rounded-[12px] bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-[#2A2E34] transition hover:bg-[#c4e1f8]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
      </div>

      <section className="min-w-0 w-full xl:sticky xl:top-8 xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
           

            <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
              Manage Social Media links
            </h2>
          </div>

          <span className="w-fit rounded-full bg-[#2A2E34] px-4 py-2 font-['DM_Sans'] text-[14px] md:text-[16px]  font-semibold text-white">
            {socialLinks.length} Link Added
          </span>
        </div>

        {loading ? (
          <LoadingMessage text="Loading social links..." />
        ) : socialLinks.length === 0 ? (
          <EmptyMessage text="No social links available." />
        ) : (
          <div className="flex flex-col gap-6">
            {socialLinks.map((link) => (
              <article
                key={link.id}
                className="rounded-[22px] bg-[#EEF6FD] p-5 md:p-6 shadow-md"
              >
                <p className="mb-2 font-['DM_Sans'] text-[13px] md:text-[14px] font-bold uppercase tracking-[1.2px] text-[#00B2F9]">
                  {getPlatformLabel(link.platform)}
                </p>

                <p className="mb-4 break-all font-['DM_Sans'] text-[13px] md:text-[14px] leading-[1.7] text-[#64748B]">
                  {link.url}
                </p>

                <p className="mb-6 font-['DM_Sans'] text-[13px] md:text-[14px] font-semibold text-[#64748B]">
                  Order: {link.sort_order ?? "-"}
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(link)}
                    className="inline-flex h-[42px] flex-1 items-center justify-center rounded-[10px] bg-[#FFFFFF] px-4 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => confirmDelete(link)}
                    disabled={deletingId === link.id}
                    className="inline-flex h-[42px] flex-1 items-center justify-center rounded-[10px] bg-[#FEECEC] px-4 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-[#DC2626] transition hover:bg-[#FDDDDD] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === link.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PopupBannerManager() {
  const [popups, setPopups] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [croppedSize, setCroppedSize] = useState(null);
  const [cropSource, setCropSource] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [previewPopup, setPreviewPopup] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showingId, setShowingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [popupToDelete, setPopupToDelete] = useState(null);

  const fetchPopups = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/popup`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch banners."
        );
      }

      setPopups(Array.isArray(data.popups) ? data.popups : []);
    } catch (fetchError) {
      console.error("Fetch popups error:", fetchError);

      setError(
        fetchError.message || "Unable to load banner."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) {
      return;
    }

    const sourceUrl = URL.createObjectURL(selectedImage);
    setCropSource(sourceUrl);
    setShowCropper(true);
  };

  const handleCropCancel = () => {
    if (cropSource) {
      URL.revokeObjectURL(cropSource);
    }

    setCropSource("");
    setShowCropper(false);
    setFileInputKey((currentKey) => currentKey + 1);
  };

  const handleCropComplete = ({ file, previewUrl, width, height }) => {
    if (cropSource) {
      URL.revokeObjectURL(cropSource);
    }

    setImage(file);
    setPreview(previewUrl);
    setCroppedSize({ width, height });
    setCropSource("");
    setShowCropper(false);
    setError("");
  };

  const resetForm = () => {
    setImage(null);
    setPreview("");
    setCroppedSize(null);
    setEditingId(null);
    setError("");
    setFileInputKey((currentKey) => currentKey + 1);
  };

  const handleEdit = (popup) => {
    setEditingId(popup.id);
    setImage(null);
    setPreview(popup.image || "");
    setCroppedSize({
      width: popup.width,
      height: popup.height,
    });
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleResizeClick = () => {
    if (preview) {
      setCropSource(preview);
      setShowCropper(true);
    } else {
      setError("Please select an image first.");
    }
  };

  const handlePreviewForm = () => {
    if (!preview || !croppedSize) {
      setError("Please crop an image before preview.");
      return;
    }

    setPreviewPopup({
      image: preview,
      width: croppedSize.width,
      height: croppedSize.height,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!croppedSize?.width || !croppedSize?.height) {
      setError("Please crop the popup image.");
      return;
    }

    if (!editingId && !image) {
      setError("Popup image is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("width", String(croppedSize.width));
      formData.append("height", String(croppedSize.height));

      if (image) {
        formData.append("image", image);
      }

      const requestUrl = editingId
        ? `${API_URL}/api/popup/${editingId}`
        : `${API_URL}/api/popup`;

      const response = await fetch(requestUrl, {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save  banner."
        );
      }

      setSuccess(
        editingId
          ? "Banner updated successfully."
          : "Banner added successfully."
      );

      resetForm();
      await fetchPopups();
    } catch (submitError) {
      console.error("Save banner error:", submitError);

      setError(
        submitError.message || "Unable to save banner."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleShow = async (popup) => {
    if (popup.is_active) {
      return;
    }

    try {
      setShowingId(popup.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/popup/${popup.id}/show`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to show popup on website."
        );
      }

      setSuccess("Banner is now shown on the website.");
      await fetchPopups();
    } catch (showError) {
      console.error("Show banner error:", showError);

      setError(
        showError.message || "Unable to show banner on website."
      );
    } finally {
      setShowingId(null);
    }
  };

  const handleHide = async (popup) => {
    if (!popup.is_active) {
      return;
    }

    try {
      setShowingId(popup.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/popup/${popup.id}/hide`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to hide banner on website."
        );
      }

      setSuccess("Banner is no longer shown on the website.");
      await fetchPopups();
    } catch (hideError) {
      console.error("Hide banner error:", hideError);

      setError(
        hideError.message || "Unable to hide banner on website."
      );
    } finally {
      setShowingId(null);
    }
  };

  const confirmDelete = (popup) => {
    setPopupToDelete(popup);
  };

  const handleDelete = async () => {
    if (!popupToDelete) return;
    
    const popupId = popupToDelete.id;

    try {
      setDeletingId(popupId);
      setError("");
      setSuccess("");
      setPopupToDelete(null);

      const response = await fetch(
        `${API_URL}/api/popup/${popupId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete banner."
        );
      }

      if (editingId === popupId) {
        resetForm();
      }

      setSuccess("Banner deleted successfully.");
      await fetchPopups();
    } catch (deleteError) {
      console.error("Delete banner error:", deleteError);

      setError(
        deleteError.message || "Unable to delete banner."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {showCropper && cropSource && (
        <PopupImageCropper
          imageSrc={cropSource}
          onCancel={handleCropCancel}
          onComplete={handleCropComplete}
        />
      )}

      {previewPopup && (
        <PopupPreviewModal
          popup={previewPopup}
          onClose={() => setPreviewPopup(null)}
        />
      )}

      {popupToDelete && (
        <DeleteConfirmModal
          title="Delete Banner"
          message="Are you sure you want to delete this banner? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setPopupToDelete(null)}
          isDeleting={deletingId === popupToDelete.id}
        />
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_minmax(0,1fr)] xl:items-start">
        <div className="xl:sticky xl:top-8">
        <section className="h-fit rounded-[20px] bg-[#EEF6FD] p-5 shadow-md md:p-6">
          <div className="mb-4">
          

            <h2 className="font-['Space_Grotesk'] text-[22px] font-bold text-[#2A2E34] md:text-[25px]">
              {editingId
                ? "Edit Banner"
                : "Add Banner"}
            </h2>
          </div>

          <StatusMessage error={error} success={success} />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="mb-2 block font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-[#2A2E34]">
                Image
              </label>

              <input
                key={fileInputKey}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
                className="w-full rounded-[12px] border border-[#DCE3EA] bg-[#FFFFFF] px-3 py-3 font-['DM_Sans'] hover:underline text-[14px] md:text-[16px] text-[#64748B] file:mr-4 file:rounded-[8px] file:border-0 file:bg-[#EEF6FD] file:px-4 file:py-2 file:font-semibold file:text-[#00B2F9]"
              />

              <p className="mt-2 font-['DM_Sans'] text-[12px] text-[#64748B]">
                {editingId
                  ? "Select a new image to crop and replace the existing banner."
                  : "After selecting an image, crop it to set the banner size."}
              </p>
            </div>

            {preview && croppedSize && (
              <div>
                <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white">
                  <img
                    src={preview}
                    alt="Cropped banner preview"
                    className="w-full max-h-[110px] object-contain"
                  />
                </div>

                <p className="mt-2 font-['DM_Sans'] text-[12px] text-[#64748B]">
                  Cropped size: {croppedSize.width}px ×{" "}
                  {croppedSize.height}px
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handlePreviewForm}
                disabled={!preview || !croppedSize}
                className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] flex-1 items-center border border-[#D1D5DB] justify-center rounded-[12px] bg-[#fcfbfb] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Preview
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#00B2F9] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Add"}
              </button>
            </div>

            {preview && (
              <button
                type="button"
                onClick={handleResizeClick}
                className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] items-center justify-center gap-2 rounded-[12px] border bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
              >
                <Crop size={18} />
                Resize
              </button>
            )}

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex py-4 md:py-0 min-h-[56px] md:min-h-[46px] md:h-[46px] items-center justify-center rounded-[12px] bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-[#2A2E34] transition hover:bg-[#c4e1f8]"
              >
                Cancel
              </button>
            )}
          </form>
        </section>
        </div>

        <section className="min-w-0 w-full xl:sticky xl:top-8 xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
         <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <div>
    

    <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
      Manage Banners
    </h2>
  </div>

  <span className="w-fit rounded-full bg-[#2A2E34] px-4 py-2 font-['DM_Sans'] text-[13px] md:text-[16px] font-semibold text-white">
    {popups.length} Banner
  </span>
</div>

          {loading ? (
            <LoadingMessage text="Loading banners..." />
          ) : popups.length === 0 ? (
            <EmptyMessage text="No banners available." />
          ) : (
            <div className="flex flex-col gap-6">
              {popups.map((popup) => (
                <article
                  key={popup.id}
                  className="rounded-[22px] bg-[#EEF6FD] p-5 md:p-6 shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="font-['DM_Sans'] text-[14px] text-[#64748B]">
                      Size: {popup.width}px × {popup.height}px
                    </p>

                    {popup.is_active ? (
                      <span className="rounded-full bg-[#15803D] px-4 py-1.5 font-['DM_Sans'] text-[12px] md:text-[14px] font-semibold text-white">
                        Showing on website
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#CBD5E1] px-4 py-1.5 font-['DM_Sans'] text-[12px] md:text-[14px] font-semibold text-[#2A2E34]">
                        Not shown
                      </span>
                    )}
                  </div>

                  <div className="mb-4 overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white">
                    <img
                      src={popup.image}
                      alt="Popup banner"
                      className="h-[280px] w-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <button
                      type="button"
                      onClick={() => setPreviewPopup(popup)}
                      className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#FFFFFF] px-4 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
                    >
                      Preview
                    </button>

                    {popup.is_active ? (
                      <button
                        type="button"
                        onClick={() => handleHide(popup)}
                        disabled={showingId === popup.id}
                        className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#4485b1] px-4 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-white transition hover:bg-[#6fb8ce] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {showingId === popup.id
                          ? "Hiding..."
                          : "Unshow"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleShow(popup)}
                        disabled={showingId === popup.id}
                        className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#00B2F9] px-4 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {showingId === popup.id
                          ? "Showing..."
                          : "Show"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleEdit(popup)}
                      className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#FFFFFF] px-4 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => confirmDelete(popup)}
                      disabled={deletingId === popup.id}
                      className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#FEECEC] px-4 font-['DM_Sans'] text-[14px] md:text-[15px] font-semibold text-[#DC2626] transition hover:bg-[#FDDDDD] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === popup.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block font-['DM_Sans'] text-[14px] md:text-[16px] font-semibold text-[#2A2E34]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[46px] w-full rounded-[12px] border border-[#DCE3EA] bg-white px-4 font-['DM_Sans'] text-[15px] text-[#2A2E34] outline-none transition focus:border-[#00B2F9] focus:ring-2 focus:ring-[#00B2F9]/15"
      />
    </div>
  );
}

function StatusMessage({ error, success }) {
  return (
    <>
      {error && (
        <div className="mb-5 rounded-[12px] bg-[#FEECEC] px-4 py-3 font-['DM_Sans'] text-[14px] text-[#DC2626]">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-[12px] bg-[#E9F9EF] px-4 py-3 font-['DM_Sans'] text-[14px] text-[#15803D]">
          {success}
        </div>
      )}
    </>
  );
}

function LoadingMessage({ text }) {
  return (
    <div className="rounded-[16px] bg-white px-6 py-12 text-center font-['DM_Sans'] text-[16px] text-[#64748B] shadow-md">
      {text}
    </div>
  );
}

function EmptyMessage({ text }) {
  return (
    <div className="rounded-[16px] border border-dashed border-[#CBD5E1] bg-white px-6 py-12 text-center font-['DM_Sans'] text-[16px] text-[#64748B] shadow-md">
      {text}
    </div>
  );
}

const ContactGridPattern = ({ offsetX, offsetY, active }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={
            active
              ? "grid-pattern-active-contact"
              : "grid-pattern-base-contact"
          }
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            className={
              active
                ? "text-[#0EA5E9]/[0.25]"
                : "text-[#2A2E34]/[0.03]"
            }
          />
        </motion.pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={
          active
            ? "url(#grid-pattern-active-contact)"
            : "url(#grid-pattern-base-contact)"
        }
      />
    </svg>
  );
};

function DeleteConfirmModal({ title, message, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20262C]/80 px-4 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[20px] bg-[#FFFFFF] p-6 shadow-2xl md:p-8">
        <h3 className="mb-3 font-['Space_Grotesk'] text-[22px] font-bold text-[#2A2E34]">
          {title}
        </h3>
        <p className="mb-8 font-['DM_Sans'] text-[15px] text-[#64748B]">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#EEF6FD] px-5 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-[#2A2E34] transition hover:bg-[#c4e1f8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#DC2626] px-5 font-['DM_Sans'] text-[15px] md:text-[17px] font-semibold text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
