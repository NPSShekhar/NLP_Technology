import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";
import PopupImageCropper from "../components/PopupImageCropper";
import PopupPreviewModal from "../components/PopupPreviewModal";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("services");

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

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-[#FFFFFF] px-4 py-8 md:px-8 lg:px-12"
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

            <h1 className="font-['Space_Grotesk'] text-[26px] font-bold md:text-[32px] lg:text-[38px]">
              Content Management
            </h1>

            <p className="mt-2 font-['DM_Sans'] text-[14px] text-[#CBD5E1] md:text-[16px]">
              Add, update and delete Products & Services, Team members and Banners.
            </p>
          </div>

  <Link
  to="/"
  className="inline-flex h-[44px] w-fit shrink-0 whitespace-nowrap items-center justify-center rounded-[12px] bg-[#00B2F9] px-6 font-['DM_Sans'] text-[15px] md:text-[16px] lg:text-[17px] font-medium text-[#FFFFFF] hover:bg-[#0EA5E9] hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md"
>
  Back to website
</Link>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-3 rounded-[16px] bg-[#EEF6FD] p-3 shadow-md">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`h-[44px] rounded-[12px] px-6 font-['DM_Sans'] text-[15px] font-semibold transition ${
              activeTab === "services"
                ? "bg-[#00B2F9] text-white"
                : "bg-[#FFFFFF] text-[#2A2E34] hover:bg-[#c4e1f8]"
            }`}
          >
            Products & Services
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("team")}
            className={`h-[44px] rounded-[12px] px-6 font-['DM_Sans'] text-[15px] font-semibold transition ${
              activeTab === "team"
                ? "bg-[#00B2F9] text-white"
                : "bg-[#FFFFFF] text-[#2A2E34] hover:bg-[#c4e1f8]"
            }`}
          >
            Team Members
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("popup")}
            className={`h-[44px] rounded-[12px] px-6 font-['DM_Sans'] text-[15px] font-semibold transition ${
              activeTab === "popup"
                ? "bg-[#00B2F9] text-white"
                : "bg-[#FFFFFF] text-[#2A2E34] hover:bg-[#c4e1f8]"
            }`}
          >
            Banner
          </button>
        </div>

        {activeTab === "services" ? (
          <ServicesManager />
        ) : activeTab === "team" ? (
          <TeamMembersManager />
        ) : (
          <PopupBannerManager />
        )}
      </div>
    </div>
  );
}

function ServicesManager() {
  const initialForm = {
    title: "",
    description: "",
    link_text: "",
  };

  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/services`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch services."
        );
      }

      setServices(
        Array.isArray(data.services) ? data.services : []
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
    fetchServices();
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
    });

    setImage(null);
    setPreview(service.image || "");
    setError("");
    setSuccess("");

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
          data.message || "Failed to save product & service."
        );
      }

      setSuccess(
        editingId
          ? "Product & Service updated successfully."
          : "Product & Service added successfully."
      );

      resetForm();
      await fetchServices();
    } catch (submitError) {
      console.error("Save Product & Service error:", submitError);

      setError(
        submitError.message || "Unable to save product & service."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Delete "${service.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(service.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/services/${service.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product & service."
        );
      }

      if (editingId === service.id) {
        resetForm();
      }

      setSuccess("Product & Service deleted successfully.");
      await fetchServices();
    } catch (deleteError) {
      console.error("Delete Product & Service error:", deleteError);

      setError(
        deleteError.message || "Unable to delete product & service."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_1fr]">
      {/* Form */}
      <section className="h-fit rounded-[20px] bg-[#EEF6FD] p-6 shadow-md md:p-8">
        <div className="mb-6">
          <p className="mb-2 inline-flex items-center gap-3 font-['DM_Sans'] text-[13px] md:text-[14px] lg:text-[14px] font-bold uppercase tracking-[1.5px] text-[#00B2F9]">
              <span className="block w-[22px] h-[2px] bg-[#00B2F9] flex-shrink-0"></span>
            {editingId ? "Edit Product & Service" : "Add Product & Service"}
          </p>

          <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
            {editingId
              ? "Update Product & Service"
              : "Create new Product & Service"}
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
            <label className="mb-2 block font-['DM_Sans'] text-[14px] font-semibold text-[#2A2E34]">
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

          <div>
            <label className="mb-2 block font-['DM_Sans'] text-[14px] font-semibold text-[#2A2E34]">
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
              className="inline-flex h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#00B2F9] px-6 font-['DM_Sans'] text-[15px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
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
                className="inline-flex h-[46px] items-center justify-center rounded-[12px] bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] font-semibold text-[#2A2E34] transition hover:bg-[#c4e1f8]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Services list */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-3 font-['DM_Sans'] text-[13px] md:text-[14px] lg:text-[14px] font-bold uppercase tracking-[1.5px] text-[#00B2F9]">
                <span className="block w-[22px] h-[2px] bg-[#00B2F9] flex-shrink-0"></span>
              Existing Products & Services
            </p>

            <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
              Manage Products & Services
            </h2>
          </div>

          <span className="rounded-full bg-[#2A2E34] px-4 py-2 font-['DM_Sans'] text-[13px] md:text-[14px] lg:text-[14px] font-semibold text-white">
            {services.length} Products & Services
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

                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(service)}
                        className="inline-flex h-[42px] flex-1 items-center justify-center rounded-[10px] bg-[#FFFFFF] px-4 font-['DM_Sans'] text-[14px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(service)}
                        disabled={deletingId === service.id}
                        className="inline-flex h-[42px] flex-1 items-center justify-center rounded-[10px] bg-[#FEECEC] px-4 font-['DM_Sans'] text-[14px] font-semibold text-[#DC2626] transition hover:bg-[#FDDDDD] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === service.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TeamMembersManager() {
  const initialForm = {
    name: "",
    role: "",
  };

  const [teamMembers, setTeamMembers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/team-members`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch team members."
        );
      }

      setTeamMembers(
        Array.isArray(data.team_members)
          ? data.team_members
          : []
      );
    } catch (fetchError) {
      console.error("Fetch team members error:", fetchError);

      setError(
        fetchError.message ||
          "Unable to load team members."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
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

  const handleEdit = (member) => {
    setEditingId(member.id);

    setForm({
      name: member.name || "",
      role: member.role || "",
    });

    setImage(null);
    setPreview(member.image || "");
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Team member name is required.");
      return;
    }

    if (!form.role.trim()) {
      setError("Team member role is required.");
      return;
    }

    if (!editingId && !image) {
      setError("Team member image is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("role", form.role.trim());

      if (image) {
        formData.append("image", image);
      }

      const requestUrl = editingId
        ? `${API_URL}/api/team-members/${editingId}`
        : `${API_URL}/api/team-members`;

      const response = await fetch(requestUrl, {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save team member."
        );
      }

      setSuccess(
        editingId
          ? "Team member updated successfully."
          : "Team member added successfully."
      );

      resetForm();
      await fetchTeamMembers();
    } catch (submitError) {
      console.error("Save team member error:", submitError);

      setError(
        submitError.message ||
          "Unable to save team member."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Delete "${member.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(member.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/team-members/${member.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete team member."
        );
      }

      if (editingId === member.id) {
        resetForm();
      }

      setSuccess("Team member deleted successfully.");
      await fetchTeamMembers();
    } catch (deleteError) {
      console.error("Delete team member error:", deleteError);

      setError(
        deleteError.message ||
          "Unable to delete team member."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_1fr]">
      {/* Form */}
      <section className="h-fit rounded-[20px] bg-[#EEF6FD] p-6 shadow-md md:p-8">
        <div className="mb-6">
          <p className="mb-2 inline-flex items-center gap-3 font-['DM_Sans'] text-[13px] md:text-[14px] lg:text-[14px] font-bold uppercase tracking-[1.5px] text-[#00B2F9]">
             <span className="block w-[22px] h-[2px] bg-[#00B2F9] flex-shrink-0"></span> 
            {editingId
              ? "Edit team member"
              : "Add team member"}
          </p>

          <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
            {editingId
              ? "Update team member"
              : "Create team member"}
          </h2>
        </div>

        <StatusMessage error={error} success={success} />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter name"
          />

          <FormField
            label="Role"
            name="role"
            value={form.role}
            onChange={handleInputChange}
            placeholder="Example: Chief Technical Officer"
          />

          <div>
            <label className="mb-2 block font-['DM_Sans'] text-[14px] font-semibold text-[#2A2E34]">
              Image
            </label>

            <input
              key={fileInputKey}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
              className="w-full rounded-[12px] border border-[#DCE3EA] hover:underline bg-[#FFFFFF] px-3 py-3 font-['DM_Sans'] text-[14px] text-[#64748B] file:mr-4 file:rounded-[8px] file:border-0 file:bg-[#EEF6FD] file:px-4 file:py-2 file:font-semibold file:text-[#00B2F9]"
            />

            {editingId && (
              <p className="mt-2 font-['DM_Sans'] text-[12px] text-[#64748B]">
                Select a new image only when replacing the
                existing image.
              </p>
            )}
          </div>

          {preview && (
            <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0]">
              <img
                src={preview}
                alt="Team member preview"
                className="h-[260px] w-full object-cover object-top"
              />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#00B2F9] px-6 font-['DM_Sans'] text-[15px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
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
                className="inline-flex h-[46px] items-center justify-center rounded-[12px] bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] font-semibold text-[#2A2E34] transition hover:bg-[#c4e1f8]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Team list */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="inline-flex items-center gap-3 mb-2 font-['DM_Sans'] text-[13px] md:text-[14px] lg:text-[14px] font-bold uppercase tracking-[1.5px] text-[#00B2F9]">
                <span className="block w-[22px] h-[2px] bg-[#00B2F9] flex-shrink-0"></span>
              Existing members
            </p>

            <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
              Manage team
            </h2>
          </div>

          <span className="rounded-full bg-[#2A2E34] px-4 py-2 font-['DM_Sans'] text-[13px] md:text-[14px] lg:text-[14px] font-semibold text-white">
            {teamMembers.length} Members
          </span>
        </div>

        {loading ? (
          <LoadingMessage text="Loading team members..." />
        ) : teamMembers.length === 0 ? (
          <EmptyMessage text="No team members available." />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="overflow-hidden rounded-[18px] bg-[#2A2E34] shadow-md"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-[300px] w-full object-cover object-top"
                />

                <div className="p-6">
                  <p className="mb-2 font-['DM_Sans'] text-[12px] font-bold uppercase tracking-[1.2px] text-[#00B2F9]">
                    {member.role}
                  </p>

                  <h3 className="mb-5 font-['Space_Grotesk'] text-[21px] font-bold text-[#FFFFFF] ">
                    {member.name}
                  </h3>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(member)}
                      className="inline-flex h-[42px] flex-1 items-center justify-center rounded-[10px] bg-[#FFFFFF] px-4 font-['DM_Sans'] text-[14px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(member)}
                      disabled={deletingId === member.id}
                      className="inline-flex h-[42px] flex-1 items-center justify-center rounded-[10px] bg-[#FEECEC] px-4 font-['DM_Sans'] text-[14px] font-semibold text-[#DC2626] transition hover:bg-[#FDDDDD] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === member.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
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

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_1fr]">
        <section className="h-fit rounded-[20px] bg-[#EEF6FD] p-6 shadow-md md:p-8">
          <div className="mb-6">
            <p className="mb-2 inline-flex items-center gap-3 font-['DM_Sans'] text-[13px] md:text-[14px] lg:text-[14px] font-bold uppercase tracking-[1.5px] text-[#00B2F9]">
              <span className="block w-[22px] h-[2px] bg-[#00B2F9] flex-shrink-0"></span>
              {editingId ? "Edit banner" : "Add banner"}
            </p>

            <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
              {editingId
                ? "Update banner"
                : "Create banner"}
            </h2>
          </div>

          <StatusMessage error={error} success={success} />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <div>
              <label className="mb-2 block font-['DM_Sans'] text-[14px] font-semibold text-[#2A2E34]">
                Image
              </label>

              <input
                key={fileInputKey}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
                className="w-full rounded-[12px] border border-[#DCE3EA] bg-[#FFFFFF] px-3 py-3 font-['DM_Sans'] hover:underline text-[14px] text-[#64748B] file:mr-4 file:rounded-[8px] file:border-0 file:bg-[#EEF6FD] file:px-4 file:py-2 file:font-semibold file:text-[#00B2F9]"
              />

              <p className="mt-2 font-['DM_Sans'] text-[12px] text-[#64748B]">
                {editingId
                  ? "Select a new image to crop and replace the existing banner."
                  : "After selecting an image, crop it to set the banner size."}
              </p>
            </div>

            {preview && croppedSize && (
              <div>
                <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0]">
                  <img
                    src={preview}
                    alt="Cropped banner preview"
                    style={{
                      width: `${croppedSize.width}px`,
                      height: `${croppedSize.height}px`,
                      maxWidth: "100%",
                    }}
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
                className="inline-flex h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Preview
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#00B2F9] px-6 font-['DM_Sans'] text-[15px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Add"}
              </button>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-[46px] items-center justify-center rounded-[12px] bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] font-semibold text-[#2A2E34] transition hover:bg-[#c4e1f8]"
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-3 font-['DM_Sans'] text-[13px] md:text-[14px] lg:text-[14px] font-bold uppercase tracking-[1.5px] text-[#00B2F9]">
                <span className="block w-[22px] h-[2px] bg-[#00B2F9] flex-shrink-0"></span>
                Existing banners
              </p>

              <h2 className="font-['Space_Grotesk'] text-[25px] font-bold text-[#2A2E34]">
                Manage banners
              </h2>
            </div>

            <span className="rounded-full bg-[#2A2E34] px-4 py-2 font-['DM_Sans'] text-[13px] md:text-[14px] lg:text-[14px] font-semibold text-white">
              {popups.length} Banners
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
                      <span className="rounded-full bg-[#15803D] px-4 py-1.5 font-['DM_Sans'] text-[12px] font-semibold text-white">
                        Showing on website
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#CBD5E1] px-4 py-1.5 font-['DM_Sans'] text-[12px] font-semibold text-[#2A2E34]">
                        Not shown
                      </span>
                    )}
                  </div>

                  <div className="mb-4 overflow-hidden rounded-[16px] border border-[#E2E8F0]">
                    <img
                      src={popup.image}
                      alt="Popup banner"
                      style={{
                        width: `${popup.width}px`,
                        height: `${popup.height}px`,
                        maxWidth: "100%",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <button
                      type="button"
                      onClick={() => setPreviewPopup(popup)}
                      className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#FFFFFF] px-4 font-['DM_Sans'] text-[14px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
                    >
                      Preview
                    </button>

                    {popup.is_active ? (
                      <button
                        type="button"
                        onClick={() => handleHide(popup)}
                        disabled={showingId === popup.id}
                        className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#4485b1] px-4 font-['DM_Sans'] text-[14px] font-semibold text-white transition hover:bg-[#6fb8ce] disabled:cursor-not-allowed disabled:opacity-60"
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
                        className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#00B2F9] px-4 font-['DM_Sans'] text-[14px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {showingId === popup.id
                          ? "Showing..."
                          : "Show"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleEdit(popup)}
                      className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#FFFFFF] px-4 font-['DM_Sans'] text-[14px] font-semibold text-[#00A3E6] transition hover:bg-[#c4e1f8]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => confirmDelete(popup)}
                      disabled={deletingId === popup.id}
                      className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#FEECEC] px-4 font-['DM_Sans'] text-[14px] font-semibold text-[#DC2626] transition hover:bg-[#FDDDDD] disabled:cursor-not-allowed disabled:opacity-60"
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
}) {
  return (
    <div>
      <label className="mb-2 block font-['DM_Sans'] text-[14px] font-semibold text-[#2A2E34]">
        {label}
      </label>

      <input
        type="text"
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
            className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#EEF6FD] px-5 font-['DM_Sans'] text-[14px] font-semibold text-[#2A2E34] transition hover:bg-[#c4e1f8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#DC2626] px-5 font-['DM_Sans'] text-[14px] font-semibold text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
