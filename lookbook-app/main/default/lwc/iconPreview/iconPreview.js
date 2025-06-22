import { LightningElement } from "lwc";

export default class IconPreview extends LightningElement {
  _allIconNames = [
    "checkbox-indeterminate",
    "checkbox-indeterminate-alt",
    "circle-gray-20",
    "correct8",
    "correct8-alt",
    "file",
    "file-excel",
    "file-pdf",
    "file-video",
    "file-word",
    "icon-dot-gov",
    "icon-https",
    "loader",
    "lock",
    "sprite",
    "us_flag",
    "usa_accessibility_new",
    "usa_accessible_forward",
    "usa_account_balance",
    "usa_account_box",
    "usa_account_circle",
    "usa_add",
    "usa_add_circle",
    "usa_add_circle_outline",
    "usa_alarm",
    "usa_alternate_email",
    "usa_announcement",
    "usa_api",
    "usa_arrow_back",
    "usa_arrow_downward",
    "usa_arrow_drop_down",
    "usa_arrow_drop_up",
    "usa_arrow_forward",
    "usa_arrow_upward",
    "usa_assessment",
    "usa_attach_file",
    "usa_attach_money",
    "usa_autorenew",
    "usa_backpack",
    "usa_bathtub",
    "usa_bedding",
    "usa_bookmark",
    "usa_bug_report",
    "usa_build",
    "usa_calendar_today",
    "usa_campaign",
    "usa_camping",
    "usa_cancel",
    "usa_chat",
    "usa_check",
    "usa_check_box_outline_blank",
    "usa_check_circle",
    "usa_check_circle_outline",
    "usa_checkroom",
    "usa_chevron_left",
    "usa_chevron_right",
    "usa_clean_hands",
    "usa_close",
    "usa_closed_caption",
    "usa_clothes",
    "usa_cloud",
    "usa_code",
    "usa_comment",
    "usa_connect_without_contact",
    "usa_construction",
    "usa_construction_worker",
    "usa_contact_page",
    "usa_content_copy",
    "usa_coronavirus",
    "usa_credit_card",
    "usa_deck",
    "usa_delete",
    "usa_device_thermostat",
    "usa_directions",
    "usa_directions_bike",
    "usa_directions_bus",
    "usa_directions_car",
    "usa_directions_walk",
    "usa_do_not_disturb",
    "usa_do_not_touch",
    "usa_drag_handle",
    "usa_eco",
    "usa_edit",
    "usa_electrical_services",
    "usa_emoji_events",
    "usa_error",
    "usa_error_outline",
    "usa_event",
    "usa_expand_less",
    "usa_expand_more",
    "usa_facebook",
    "usa_fast_forward",
    "usa_fast_rewind",
    "usa_favorite",
    "usa_favorite_border",
    "usa_fax",
    "usa_file_download",
    "usa_file_present",
    "usa_file_upload",
    "usa_filter_alt",
    "usa_filter_list",
    "usa_fingerprint",
    "usa_first_page",
    "usa_flag",
    "usa_flickr",
    "usa_flight",
    "usa_flooding",
    "usa_folder",
    "usa_folder_open",
    "usa_format_quote",
    "usa_format_size",
    "usa_forum",
    "usa_github",
    "usa_grid_view",
    "usa_group_add",
    "usa_groups",
    "usa_hearing",
    "usa_help",
    "usa_help_outline",
    "usa_highlight_off",
    "usa_history",
    "usa_home",
    "usa_hospital",
    "usa_hotel",
    "usa_hourglass_empty",
    "usa_hurricane",
    "usa_identification",
    "usa_image",
    "usa_info",
    "usa_info_outline",
    "usa_insights",
    "usa_instagram",
    "usa_keyboard",
    "usa_label",
    "usa_language",
    "usa_last_page",
    "usa_launch",
    "usa_lightbulb",
    "usa_lightbulb_outline",
    "usa_link",
    "usa_link_off",
    "usa_linkedin",
    "usa_list",
    "usa_local_cafe",
    "usa_local_fire_department",
    "usa_local_gas_station",
    "usa_local_grocery_store",
    "usa_local_hospital",
    "usa_local_laundry_service",
    "usa_local_library",
    "usa_local_offer",
    "usa_local_parking",
    "usa_local_pharmacy",
    "usa_local_police",
    "usa_local_taxi",
    "usa_location_city",
    "usa_location_on",
    "usa_lock",
    "usa_lock_open",
    "usa_lock_outline",
    "usa_login",
    "usa_logout",
    "usa_loop",
    "usa_mail",
    "usa_mail_outline",
    "usa_map",
    "usa_masks",
    "usa_medical_services",
    "usa_menu",
    "usa_military_tech",
    "usa_more_horiz",
    "usa_more_vert",
    "usa_my_location",
    "usa_navigate_before",
    "usa_navigate_far_before",
    "usa_navigate_far_next",
    "usa_navigate_next",
    "usa_near_me",
    "usa_notifications",
    "usa_notifications_active",
    "usa_notifications_none",
    "usa_notifications_off",
    "usa_park",
    "usa_people",
    "usa_person",
    "usa_pets",
    "usa_phone",
    "usa_photo_camera",
    "usa_print",
    "usa_priority_high",
    "usa_public",
    "usa_push_pin",
    "usa_radio_button_unchecked",
    "usa_rain",
    "usa_reduce_capacity",
    "usa_remove",
    "usa_remove_circle",
    "usa_report",
    "usa_restaurant",
    "usa_rss_feed",
    "usa_safety_divider",
    "usa_sanitizer",
    "usa_save_alt",
    "usa_schedule",
    "usa_school",
    "usa_science",
    "usa_search",
    "usa_security",
    "usa_send",
    "usa_sentiment_dissatisfied",
    "usa_sentiment_neutral",
    "usa_sentiment_satisfied",
    "usa_sentiment_satisfied_alt",
    "usa_sentiment_very_dissatisfied",
    "usa_settings",
    "usa_severe_weather",
    "usa_share",
    "usa_shield",
    "usa_shopping_basket",
    "usa_snow",
    "usa_soap",
    "usa_social_distance",
    "usa_sort_arrow",
    "usa_spellcheck",
    "usa_star",
    "usa_star_half",
    "usa_star_outline",
    "usa_store",
    "usa_support",
    "usa_support_agent",
    "usa_text_fields",
    "usa_thumb_down_alt",
    "usa_thumb_up_alt",
    "usa_timer",
    "usa_toggle_off",
    "usa_toggle_on",
    "usa_topic",
    "usa_tornado",
    "usa_translate",
    "usa_trending_down",
    "usa_trending_up",
    "usa_twitter",
    "usa_undo",
    "usa_unfold_less",
    "usa_unfold_more",
    "usa_update",
    "usa_upload_file",
    "usa_verified",
    "usa_verified_user",
    "usa_visibility",
    "usa_visibility_off",
    "usa_volume_off",
    "usa_warning",
    "usa_wash",
    "usa_wifi",
    "usa_work",
    "usa_x",
    "usa_youtube",
    "usa_zoom_in",
    "usa_zoom_out",
    "usa_zoom_out_map"
  ];

  searchKey = "";
  copiedIconName = null;

  get iconList() {
    const filteredList = this._allIconNames.filter((name) =>
      name.toLowerCase().includes(this.searchKey.toLowerCase())
    );

    return filteredList.map((name) => ({
      name: name,
      isCopied: name === this.copiedIconName
    }));
  }

  get iconCount() {
    const count = this.iconList.length;
    return `${count} icon${count === 1 ? "" : "s"}`;
  }

  searchIcons(event) {
    this.searchKey = event.target.value;
  }

  copyIconName(event) {
    const iconName = event.currentTarget.dataset.icon;

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(iconName)
        .then(() => {
          this.showCopiedMessage(iconName);
        })
        .catch(() => {
          // Fallback to selection method
          this.fallbackCopy(iconName);
        });
    } else {
      // Fallback for older browsers
      this.fallbackCopy(iconName);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      this.showCopiedMessage(text);
    } catch (err) {
      console.error("Copy failed:", err);
    }

    document.body.removeChild(textArea);
  }

  showCopiedMessage(iconName) {
    this.copiedIconName = iconName;
    setTimeout(() => {
      this.copiedIconName = null;
    }, 1500);
  }
}
